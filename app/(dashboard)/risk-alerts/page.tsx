import { db } from "@/lib/db";
import { riskAlerts } from "@/lib/db/schema";
import { desc, eq, inArray } from "drizzle-orm";
import { runGlobalRiskCheck } from "@/lib/risk-engine";
import { RiskAlertsList } from "./risk-alerts-list";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { tenants } from "@/lib/db/schema";

async function getAlerts(landlordId: number) {
  await runGlobalRiskCheck(landlordId);
  
  return await db.query.riskAlerts.findMany({
    where: inArray(riskAlerts.tenantId, db.select({ id: tenants.id }).from(tenants).where(eq(tenants.landlordId, landlordId))),
    orderBy: [desc(riskAlerts.createdAt)],
    with: {
      tenant: true,
    },
  });
}

export default async function RiskAlertsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const alerts = await getAlerts(session.user.id);
  
  const serializedAlerts = JSON.parse(JSON.stringify(alerts));

  return (
    <RiskAlertsList initialAlerts={serializedAlerts} />
  );
}
