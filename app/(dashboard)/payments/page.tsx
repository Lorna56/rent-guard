import { db } from "@/lib/db";
import { payments, tenants } from "@/lib/db/schema";
import { desc, eq, inArray } from "drizzle-orm";
import { PaymentsList } from "./payments-list";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { leases } from "@/lib/db/schema";

async function getPayments(landlordId: number) {
  return await db.query.payments.findMany({
    orderBy: [desc(payments.dueDate)],
    where: inArray(payments.leaseId, db.select({ id: leases.id }).from(leases).innerJoin(tenants, eq(leases.tenantId, tenants.id)).where(eq(tenants.landlordId, landlordId))),
    with: {
      lease: {
        with: {
          tenant: true,
          property: true,
        }
      }
    }
  });
}

async function getTenants(landlordId: number) {
  return await db.query.tenants.findMany({
    where: eq(tenants.landlordId, landlordId),
    with: {
      leases: {
        with: {
          property: true,
        }
      }
    }
  });
}

export default async function PaymentsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const landlordId = session.user.id;
  const allPayments = await getPayments(landlordId);
  const allTenants = await getTenants(landlordId);

  const serializedPayments = JSON.parse(JSON.stringify(allPayments));
  const serializedTenants = JSON.parse(JSON.stringify(allTenants));

  return (
    <PaymentsList 
      initialPayments={serializedPayments}
      allTenants={serializedTenants}
    />
  );
}
