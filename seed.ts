import { db } from "./lib/db";
import { landlords, properties, tenants, leases, payments } from "./lib/db/schema";
import { subMonths, startOfMonth } from "date-fns";

async function seed() {
  console.log("Seeding data...");

  // 1. Create a landlord
  const [landlord] = await db.insert(landlords).values({
    name: "Lorna Majesty",
    email: "lorna@rentguard.com",
    phone: "+256 700 000 000",
  }).returning();

  // 2. Create a property
  const [property] = await db.insert(properties).values({
    landlordId: landlord.id,
    name: "Serene Heights Apartments",
    address: "Plot 12, Kampala, Uganda",
  }).returning();

  // 3. Create a tenant (High Risk one)
  const [highRiskTenant] = await db.insert(tenants).values({
    landlordId: landlord.id,
    name: "John Doe",
    email: "john@doe.com",
    phone: "+256 701 111 222",
  }).returning();

  // 4. Create a lease for high risk tenant
  const [lease] = await db.insert(leases).values({
    propertyId: property.id,
    tenantId: highRiskTenant.id,
    rentAmount: "1200.00",
    startDate: subMonths(new Date(), 6),
  }).returning();

  // 5. Create 2 late payments in different months within the last 4
  // Month 1 ago: Late
  await db.insert(payments).values({
    leaseId: lease.id,
    amount: "1200.00",
    dueDate: subMonths(new Date(), 1),
    paidAt: new Date(), // Paid today, definitely late
    status: "late",
  });

  // Month 3 ago: Late
  await db.insert(payments).values({
    leaseId: lease.id,
    amount: "1200.00",
    dueDate: subMonths(new Date(), 3),
    paidAt: subMonths(new Date(), 2), // Late by a month
    status: "late",
  });

  // 6. Normal Tenant
  const [normalTenant] = await db.insert(tenants).values({
    landlordId: landlord.id,
    name: "Jane Smith",
    email: "jane@smith.com",
    phone: "+256 702 333 444",
  }).returning();

  const [lease2] = await db.insert(leases).values({
    propertyId: property.id,
    tenantId: normalTenant.id,
    rentAmount: "1500.00",
    startDate: subMonths(new Date(), 2),
  }).returning();

  // On time payment
  await db.insert(payments).values({
    leaseId: lease2.id,
    amount: "1500.00",
    dueDate: subMonths(new Date(), 1),
    paidAt: subMonths(new Date(), 1),
    status: "paid",
  });

  console.log("Seeding complete!");
}

seed().catch(console.error);
