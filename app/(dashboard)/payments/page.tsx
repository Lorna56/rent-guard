import { db } from "@/lib/db";
import { payments, tenants } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { PaymentsList } from "./payments-list";

async function getPayments() {
  return await db.query.payments.findMany({
    orderBy: [desc(payments.dueDate)],
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

async function getTenants() {
  return await db.query.tenants.findMany({
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
  const allPayments = await getPayments();
  const allTenants = await getTenants();

  const serializedPayments = JSON.parse(JSON.stringify(allPayments));
  const serializedTenants = JSON.parse(JSON.stringify(allTenants));

  return (
    <PaymentsList 
      initialPayments={serializedPayments}
      allTenants={serializedTenants}
    />
  );
}
