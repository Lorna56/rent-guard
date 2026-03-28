"use client";

import { 
  AlertTriangle, 
  History, 
  Search,
  Filter,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { TakeActionModal } from "@/components/modals/take-action-modal";

interface RiskAlertsListProps {
  initialAlerts: any[];
}

export function RiskAlertsList({ initialAlerts }: RiskAlertsListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAlerts = initialAlerts.filter(alert => 
    alert.tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTakeAction = (alert: any) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight mb-2 flex items-center gap-3 text-slate-800">
            <div className="p-2 bg-rose-500/10 rounded-xl">
              <AlertTriangle className="text-rose-600 w-8 h-8" />
            </div>
            Risk Intelligence
          </h2>
          <p className="text-slate-500 font-medium">Automated monitoring of tenant payment behavior and liability.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search alerts..." 
              className="bg-white border border-border rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-border rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredAlerts.length === 0 ? (
          <Card className="flex flex-col items-center py-24 text-center border-dashed border-2 bg-slate-50/50">
            <div className="w-20 h-20 rounded-[2rem] bg-slate-100 flex items-center justify-center mb-6 shadow-inner">
              <History className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">System Secure</h3>
            <p className="text-slate-500 font-medium max-w-sm">When our engine detects concerning patterns like frequent late payments, they will appear here for immediate action.</p>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card key={alert.id} className="group relative overflow-hidden border-border hover:border-rose-500/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:translate-y-[-2px]">
              <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/5 blur-[50px] rounded-full -translate-y-1/2 translate-x-1/2" />
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 p-8 relative z-10">
                  <div className="flex items-start gap-6">
                    <div className={cn(
                      "w-16 h-16 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:scale-110 duration-300",
                      alert.severity === "high" ? "bg-rose-500 text-white shadow-rose-500/20" : "bg-amber-500 text-white shadow-amber-500/20"
                    )}>
                      <AlertTriangle className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <h4 className="text-xl font-black text-slate-800 tracking-tight">{alert.tenant.name}</h4>
                        <Badge variant={alert.severity === "high" ? "danger" : "warning"}>
                          {alert.type.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-slate-500 max-w-2xl leading-relaxed">{alert.message}</p>
                      <div className="flex items-center gap-4 mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest italic">
                        <div className="flex items-center gap-1.5">
                          <History className="w-4 h-4" />
                          Detected: {new Date(alert.createdAt!).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleTakeAction(alert)}
                      className="px-6 py-3 bg-rose-500 text-white rounded-[1.25rem] text-sm font-bold shadow-xl shadow-rose-500/20 hover:bg-rose-600 hover:translate-y-[-2px] transition-all flex items-center gap-2"
                    >
                       Take Action
                       <ArrowRight className="w-4 h-4" />
                    </button>
                    <button className="p-3 bg-white border border-border rounded-[1.25rem] text-slate-400 hover:text-slate-800 hover:border-slate-300 transition-all shadow-sm">
                      Archive
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {selectedAlert && (
        <TakeActionModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          tenant={selectedAlert.tenant} 
          alertType={selectedAlert.type}
        />
      )}
    </div>
  );
}
