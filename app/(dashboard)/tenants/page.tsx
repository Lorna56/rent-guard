import { db } from "@/lib/db";
import { tenants, properties } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { TenantsList } from "./tenants-list";

async function getTenants() {
  return await db.query.tenants.findMany({
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

async function getProperties() {
  return await db.query.properties.findMany({
    columns: {
      id: true,
      name: true,
    }
  });
}

export default async function TenantsPage() {
  const allTenants = await getTenants();
  const allProperties = await getProperties();

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
