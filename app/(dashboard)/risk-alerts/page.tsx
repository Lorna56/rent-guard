import { db } from "@/lib/db";
import { riskAlerts } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { runGlobalRiskCheck } from "@/lib/risk-engine";
import { RiskAlertsList } from "./risk-alerts-list";

async function getAlerts() {
  await runGlobalRiskCheck();
  
  return await db.query.riskAlerts.findMany({
    orderBy: [desc(riskAlerts.createdAt)],
    with: {
      tenant: true,
    },
  });
}

export default async function RiskAlertsPage() {
  const alerts = await getAlerts();
  
  const serializedAlerts = JSON.parse(JSON.stringify(alerts));

  return (
    <RiskAlertsList initialAlerts={serializedAlerts} />
  );
}
