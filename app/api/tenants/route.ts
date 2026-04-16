import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tenants, leases, landlords } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, phone, propertyId, rentAmount, startDate } = await req.json();

    if (!name || !email || !phone || !propertyId || !rentAmount || !startDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Get the authenticated landlord
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const landlordId = session.user.id;

    // 2. Perform the insertion in a transaction (simulated with consecutive awaits for simplicity in current setup)
    const [newTenant] = await db.insert(tenants).values({
      landlordId: landlordId,
      name,
      email,
      phone,
      riskScore: 0,
    }).returning();

    await db.insert(leases).values({
      tenantId: newTenant.id,
      propertyId: Number(propertyId),
      rentAmount: rentAmount.toString(),
      startDate: new Date(startDate),
      isActive: true,
    });

    return NextResponse.json({ success: true, tenant: newTenant });

  } catch (error) {
    console.error("API Tenant Error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Internal Server Error" 
    }, { status: 500 });
  }
}
