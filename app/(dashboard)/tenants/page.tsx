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
import { cn } from "@/lib/utils";

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-800">Tenant Directory</h2>
          <p className="text-slate-500 font-medium mt-1">Manage your active residents and their lease history.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:translate-y-[-2px] active:scale-[0.98] transition-all">
          <Plus className="w-5 h-5" />
          Add New Tenant
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, email, or phone..." 
            className="w-full bg-white border border-border rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-border rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
          <Filter className="w-5 h-5" />
          Advanced Filters
        </button>
      </div>

      <div className="grid gap-6">
        {allTenants.length === 0 ? (
          <div className="text-center py-20 glass rounded-[2.5rem] border-dashed border-2 border-slate-200">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">No tenants recorded yet.</p>
            <button className="mt-4 text-primary font-bold hover:underline">Add your first tenant</button>
          </div>
        ) : (
          allTenants.map((tenant) => (
            <Card key={tenant.id} className="group overflow-hidden border-border hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:translate-y-[-2px]">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 p-6">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-primary/20 shrink-0">
                      {tenant.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-black text-slate-800 group-hover:text-primary transition-colors tracking-tight">{tenant.name}</h4>
                        <Badge variant={tenant.riskScore && tenant.riskScore > 50 ? "danger" : "success"}>
                          {tenant.riskScore && tenant.riskScore > 50 ? "High Risk" : "Stable"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-5 text-sm font-medium text-slate-500">
                        <span className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                          <Mail className="w-4 h-4 text-primary/60" />
                          {tenant.email}
                        </span>
                        <span className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                          <Phone className="w-4 h-4 text-primary/60" />
                          {tenant.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-10 lg:gap-16 pr-4">
                    <div className="space-y-1.5">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black">Active Property</p>
                      <p className="text-sm font-bold text-slate-700">
                        {tenant.leases[0]?.property?.name || "No active lease"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black">Risk Analysis</p>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div 
                            className={cn(
                              "h-full transition-all duration-1000",
                              tenant.riskScore && tenant.riskScore > 50 ? "bg-rose-500" : "bg-emerald-500"
                            )} 
                            style={{ width: `${tenant.riskScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-black text-slate-600 uppercase italic">{tenant.riskScore}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="px-6 py-2.5 bg-secondary text-secondary-foreground border border-primary/10 rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-2 shadow-sm">
                      View Profile
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 bg-white border border-border rounded-xl text-slate-400 hover:text-primary hover:border-primary/30 transition-all shadow-sm">
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
