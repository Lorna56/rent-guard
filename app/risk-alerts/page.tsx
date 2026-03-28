import { 
  AlertTriangle, 
  History, 
  Search,
  Filter,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { riskAlerts, tenants } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { runGlobalRiskCheck } from "@/lib/risk-engine";

async function getAlerts() {
  // We run a check on every load for this demo to ensure latest alerts
  await runGlobalRiskCheck();
  
  return await db.query.riskAlerts.findMany({
    orderBy: [desc(riskAlerts.createdAt)],
    with: {
      tenant: true,
    },
  });
}

export default async function RiskAlertsPage() {
  const alerts = await getAlerts();

  return (
    <div className="space-y-8 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <AlertTriangle className="text-rose-500" />
            Risk Intelligence
          </h2>
          <p className="text-slate-400">Automated monitoring of tenant payment behavior and liability.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search alerts..." 
              className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-all font-medium">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {alerts.length === 0 ? (
          <Card className="flex flex-col items-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-6">
              <History className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No risk alerts yet</h3>
            <p className="text-slate-500 max-w-sm">When our engine detects concerning patterns like frequent late payments, they will appear here.</p>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id} className="group relative overflow-hidden border-rose-500/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-[40px] rounded-full -translate-y-1/2 translate-x-1/2" />
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6">
                  <div className="flex items-start gap-5">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                      alert.severity === "high" ? "bg-rose-500/20 text-rose-500" : "bg-amber-500/20 text-amber-500"
                    )}>
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-lg font-bold text-white">{alert.tenant.name}</h4>
                        <Badge variant={alert.severity === "high" ? "danger" : "warning"}>
                          {alert.type.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400 max-w-xl">{alert.message}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <History className="w-3 h-3" />
                          Detected: {new Date(alert.createdAt!).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-semibold shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all flex items-center gap-2">
                       Take Action
                       <ArrowRight className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-white/5 border border-white/5 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-all">
                      Archive
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
