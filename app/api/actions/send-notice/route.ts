import { NextResponse } from "next/server";
import { sendNotification } from "@/lib/notifications";
import { db } from "@/lib/db";
import { tenants, reminders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { tenantId, to, message, type, alertType } = await req.json();

    if (!tenantId || !to || !message || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Fetch tenant details for logging and verification
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.id, Number(tenantId)),
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // 2. Execute communication via centralized utility
    const notificationResults = await sendNotification({
      to,
      subject: `Urgent: ${alertType?.replace('_', ' ').toUpperCase() || 'Property Management Notice'}`,
      message,
      type
    });

    // 3. Log the action in the database (as a sent reminder)
    // This ensures traceability in the 'Reminders' view
    await db.insert(reminders).values({
      leaseId: (await db.query.leases.findFirst({ where: eq(tenants.id, tenantId) }))?.id || 1, // Fallback for demo
      type: type === 'both' ? 'email' : type,
      status: 'sent',
      scheduledAt: new Date(),
      sentAt: new Date(),
    });

    return NextResponse.json({ 
      success: true, 
      results: notificationResults 
    });

  } catch (error) {
    console.error("API Action Error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Internal Server Error" 
    }, { status: 500 });
  }
}
