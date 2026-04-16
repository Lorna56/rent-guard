import { db } from "@/lib/db";
import { tenants, payments, riskAlerts, properties, leases } from "@/lib/db/schema";
import { count, sum, eq, desc, and, inArray } from "drizzle-orm";
import { DashboardContent } from "./dashboard-content";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

async function getStats(landlordId: number) {
  const [tenantCount] = await db.select({ value: count() }).from(tenants).where(eq(tenants.landlordId, landlordId));
  const [propertyCount] = await db.select({ value: count() }).from(properties).where(eq(properties.landlordId, landlordId));
  
  // For revenue, we need to join with properties
  const landlordProperties = await db.select({ id: properties.id }).from(properties).where(eq(properties.landlordId, landlordId));
  const propertyIds = landlordProperties.map(p => p.id);
  
  let revenue = 0;
  if (propertyIds.length > 0) {
    const [totalRevenue] = await db.select({ value: sum(payments.amount) })
      .from(payments)
      .innerJoin(leases, eq(payments.leaseId, leases.id))
      .where(and(
        eq(payments.status, "paid"),
        inArray(leases.propertyId, propertyIds)
      ));
    revenue = parseFloat(totalRevenue.value || "0");
  }

  const [activeAlerts] = await db.select({ value: count() })
    .from(riskAlerts)
    .innerJoin(tenants, eq(riskAlerts.tenantId, tenants.id))
    .where(eq(tenants.landlordId, landlordId));

  return {
    tenants: tenantCount.value || 0,
    properties: propertyCount.value || 0,
    revenue,
    alerts: activeAlerts.value || 0,
  };
}

async function getRecentAlerts(landlordId: number) {
  return await db.query.riskAlerts.findMany({
    limit: 5,
    orderBy: [desc(riskAlerts.createdAt)],
    where: inArray(riskAlerts.tenantId, db.select({ id: tenants.id }).from(tenants).where(eq(tenants.landlordId, landlordId))),
    with: {
      tenant: true,
    },
  });
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const landlordId = session.user.id;
  const stats = await getStats(landlordId);
  const alerts = await getRecentAlerts(landlordId);

  const serializedStats = JSON.parse(JSON.stringify(stats));
  const serializedAlerts = JSON.parse(JSON.stringify(alerts));

  return (
    <DashboardContent 
      stats={serializedStats} 
      recentAlerts={serializedAlerts} 
    />
  );
}
