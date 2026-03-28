import { db } from "./db";
import { payments, riskAlerts, tenants, leases } from "./db/schema";
import { eq, and, gte, lte, desc, count, sql } from "drizzle-orm";
import { subMonths } from "date-fns";

/**
 * Analyzes tenant payment history to detect high-risk behavior.
 * Rule: Flag if payment was delayed 2 or more times within the last 4 months.
 */
export async function analyzeTenantRisk(tenantId: number) {
  const fourMonthsAgo = subMonths(new Date(), 4);

  // 1. Get all payments for this tenant's active leases in the last 4 months
  // We need to join tenants -> leases -> payments
  const latePayments = await db
    .select({
      id: payments.id,
      dueDate: payments.dueDate,
      paidAt: payments.paidAt,
    })
    .from(payments)
    .innerJoin(leases, eq(payments.leaseId, leases.id))
    .where(
      and(
        eq(leases.tenantId, tenantId),
        gte(payments.dueDate, fourMonthsAgo),
        // A payment is late if it's either currently pending and past due, 
        // or was paid after the due date.
        sql`(${payments.status} = 'late' OR ${payments.paidAt} > ${payments.dueDate})`
      )
    );

  const lateCount = latePayments.length;

  if (lateCount >= 2) {
    // 2. Create or update a risk alert
    await db.insert(riskAlerts).values({
      tenantId,
      type: "multiple_delays",
      severity: "high",
      message: `Tenant has delayed payments ${lateCount} times in the last 4 months.`,
    });

    // 3. Update tenant risk score
    await db
      .update(tenants)
      .set({ riskScore: 80 }) // High risk baseline
      .where(eq(tenants.id, tenantId));
    
    return { isHighRisk: true, lateCount };
  }

  return { isHighRisk: false, lateCount };
}

/**
 * High-level function to check all active tenants for risk.
 */
export async function runGlobalRiskCheck() {
  const allTenants = await db.select().from(tenants);
  const results = [];

  for (const tenant of allTenants) {
    const result = await analyzeTenantRisk(tenant.id);
    results.push({ tenantId: tenant.id, ...result });
  }

  return results;
}
