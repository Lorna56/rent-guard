import { 
  Users, 
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  MoreVertical,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

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

export default async function TenantsPage() {
  const allTenants = await getTenants();

  return (
    <div className="space-y-8 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Tenant Directory</h2>
          <p className="text-slate-400">Manage your active residents and their lease history.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all">
          <Plus className="w-4 h-4" />
          Add Tenant
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by name, email, or phone..." 
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-all font-medium text-slate-300">
          <Filter className="w-4 h-4" />
          More Filters
        </button>
      </div>

      <div className="grid gap-6">
        {allTenants.length === 0 ? (
          <p className="text-center py-12 text-slate-500">No tenants recorded yet.</p>
        ) : (
          allTenants.map((tenant) => (
            <Card key={tenant.id} className="group relative transition-all border-white/5 hover:border-indigo-500/20">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 p-6">
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xl font-bold text-white shadow-xl shadow-indigo-500/10 shrink-0">
                      {tenant.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{tenant.name}</h4>
                        <Badge variant={tenant.riskScore && tenant.riskScore > 50 ? "danger" : "success"}>
                          {tenant.riskScore && tenant.riskScore > 50 ? "High Risk" : "Stable"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                          <Mail className="w-4 h-4 text-indigo-400/60" />
                          {tenant.email}
                        </span>
                        <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                          <Phone className="w-4 h-4 text-indigo-400/60" />
                          {tenant.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-10 lg:gap-16 pr-4">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Property</p>
                      <p className="text-sm font-semibold text-white">
                        {tenant.leases[0]?.property?.name || "No active lease"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Risk Score</p>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div 
                            className={cn(
                              "h-full transition-all duration-1000",
                              tenant.riskScore && tenant.riskScore > 50 ? "bg-rose-500" : "bg-emerald-500"
                            )} 
                            style={{ width: `${tenant.riskScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-300">{tenant.riskScore}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm font-semibold hover:bg-indigo-600/20 hover:text-indigo-400 transition-all flex items-center gap-2">
                      View Profile
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 bg-white/5 border border-white/5 rounded-lg text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
