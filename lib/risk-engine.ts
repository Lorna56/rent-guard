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
 * Optimized to use a single query for identifying risk patterns across the entire database.
 */
export async function runGlobalRiskCheck() {
  const fourMonthsAgo = subMonths(new Date(), 4);

  // 1. Find all tenants who have 2+ late payments in the last 4 months
  const atRiskTenants = await db
    .select({
      tenantId: tenants.id,
      lateCount: count(payments.id),
    })
    .from(payments)
    .innerJoin(leases, eq(payments.leaseId, leases.id))
    .innerJoin(tenants, eq(leases.tenantId, tenants.id))
    .where(
      and(
        gte(payments.dueDate, fourMonthsAgo),
        sql`(${payments.status} = 'late' OR ${payments.paidAt} > ${payments.dueDate})`
      )
    )
    .groupBy(tenants.id)
    .having(sql`count(${payments.id}) >= 2`);

  if (atRiskTenants.length === 0) return [];

  const results = [];

  // 2. Process each at-risk tenant (Batching alerts and updates is better, but this is already much faster than before)
  for (const { tenantId, lateCount } of atRiskTenants) {
    // Check if an alert already exists to avoid spamming
    const existingAlert = await db.query.riskAlerts.findFirst({
      where: and(
        eq(riskAlerts.tenantId, tenantId),
        eq(riskAlerts.type, "multiple_delays")
      ),
      orderBy: [desc(riskAlerts.createdAt)]
    });

    // Only create alert if none exists in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    if (!existingAlert || (existingAlert.createdAt && existingAlert.createdAt < thirtyDaysAgo)) {
      await db.insert(riskAlerts).values({
        tenantId,
        type: "multiple_delays",
        severity: "high",
        message: `Tenant has delayed payments ${lateCount} times in the last 4 months.`,
      });

      await db
        .update(tenants)
        .set({ riskScore: 80 })
        .where(eq(tenants.id, tenantId));
    }

    results.push({ tenantId, isHighRisk: true, lateCount });
  }

  return results;
}
