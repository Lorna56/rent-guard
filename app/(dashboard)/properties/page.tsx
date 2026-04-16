import { db } from "@/lib/db";
import { properties } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Building2, Plus, MapPin, Users, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function PropertiesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const allProperties = await db.query.properties.findMany({
    where: eq(properties.landlordId, session.user.id),
    with: {
      leases: {
        with: {
          tenant: true
        }
      }
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Properties</h1>
          <p className="text-slate-500 font-medium">Manage your real estate portfolio</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
          <Plus className="w-5 h-5" />
          Add Property
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allProperties.length === 0 ? (
          <div className="col-span-full py-20 text-center glass rounded-[2.5rem] border-dashed border-2 border-border">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No properties yet</h3>
            <p className="text-slate-500 mb-6 font-medium">Add your first property to start tracking tenants.</p>
          </div>
        ) : (
          allProperties.map((property) => (
            <div key={property.id} className="glass p-6 rounded-[2rem] border border-white hover:shadow-xl transition-all group cursor-pointer">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Building2 className="w-7 h-7" />
                </div>
                <div className="flex gap-1">
                   <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded-full border border-emerald-100">Active</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{property.name}</h3>
                  <p className="text-sm font-medium text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {property.address}
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                       {/* Mock tenant avatars */}
                       <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white" />
                       <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {property.leases.length} Tenants
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
