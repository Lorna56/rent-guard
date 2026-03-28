import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { payments, leases } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { tenantId, amount, paidAt, method } = await req.json();

    if (!tenantId || !amount || !paidAt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Find the active lease for this tenant
    const lease = await db.query.leases.findFirst({
      where: eq(leases.tenantId, Number(tenantId)),
    });

    if (!lease) {
      return NextResponse.json({ error: "No active lease found for this tenant" }, { status: 404 });
    }

    // 2. Insert the payment record
    const [newPayment] = await db.insert(payments).values({
      leaseId: lease.id,
      amount: amount.toString(),
      dueDate: new Date(paidAt), // For simplification in demo, assume due date is paid date
      paidAt: new Date(paidAt),
      status: "paid",
    }).returning();

    return NextResponse.json({ success: true, payment: newPayment });

  } catch (error) {
    console.error("API Payment Error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Internal Server Error" 
    }, { status: 500 });
  }
}
