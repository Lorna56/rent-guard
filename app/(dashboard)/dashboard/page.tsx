import { db } from "@/lib/db";
import { tenants, payments, riskAlerts, properties } from "@/lib/db/schema";
import { count, sum, eq, desc } from "drizzle-orm";
import { DashboardContent } from "./dashboard-content";

async function getStats() {
  const [tenantCount] = await db.select({ value: count() }).from(tenants);
  const [propertyCount] = await db.select({ value: count() }).from(properties);
  const [totalRevenue] = await db.select({ value: sum(payments.amount) }).from(payments).where(eq(payments.status, "paid"));
  const [activeAlerts] = await db.select({ value: count() }).from(riskAlerts);

  return {
    tenants: tenantCount.value || 0,
    properties: propertyCount.value || 0,
    revenue: parseFloat(totalRevenue.value || "0"),
    alerts: activeAlerts.value || 0,
  };
}

async function getRecentAlerts() {
  return await db.query.riskAlerts.findMany({
    limit: 5,
    orderBy: [desc(riskAlerts.createdAt)],
    with: {
      tenant: true,
    },
  });
}

export default async function DashboardPage() {
  const stats = await getStats();
  const alerts = await getRecentAlerts();

  const serializedStats = JSON.parse(JSON.stringify(stats));
  const serializedAlerts = JSON.parse(JSON.stringify(alerts));

  return (
    <DashboardContent 
      stats={serializedStats} 
      recentAlerts={serializedAlerts} 
    />
  );
}
