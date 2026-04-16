import { db } from "@/lib/db";
import { tenants, properties } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { TenantsList } from "./tenants-list";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

async function getTenants(landlordId: number) {
  return await db.query.tenants.findMany({
    where: eq(tenants.landlordId, landlordId),
    orderBy: [desc(tenants.createdAt)],
    with: {
      leases: {
        with: {
          property: true,
        }
      }
    }
  });
}

async function getProperties(landlordId: number) {
  return await db.query.properties.findMany({
    where: eq(properties.landlordId, landlordId),
    columns: {
      id: true,
      name: true,
    }
  });
}

export default async function TenantsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const landlordId = session.user.id;
  const allTenants = await getTenants(landlordId);
  const allProperties = await getProperties(landlordId);

  // Convert types to match client expectations if necessary
  const serializedTenants = JSON.parse(JSON.stringify(allTenants));
  const serializedProperties = JSON.parse(JSON.stringify(allProperties));

  return (
    <TenantsList 
      initialTenants={serializedTenants} 
      allProperties={serializedProperties} 
    />
  );
}
