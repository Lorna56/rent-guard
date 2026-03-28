"use client";

import { 
  Users, 
  Building2, 
  CreditCard, 
  AlertTriangle, 
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { TakeActionModal } from "@/components/modals/take-action-modal";

interface DashboardContentProps {
  stats: any;
  recentAlerts: any[];
}

export function DashboardContent({ stats, recentAlerts }: DashboardContentProps) {
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTakeAction = (alert: any) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-800">Portfolio Overview</h2>
          <p className="text-slate-500 font-medium mt-1">Real-time management intelligence and revenue tracking.</p>
        </div>
        <div className="flex gap-3">
           <button className="px-6 py-3 bg-white border border-border rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
             Export Summary
           </button>
           <button className="px-6 py-3 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:translate-y-[-2px] transition-all">
             Global Risk Check
           </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-md bg-emerald-50 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black text-emerald-600 uppercase tracking-widest">Gross Revenue</CardTitle>
            <CreditCard className="w-5 h-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-emerald-700 tracking-tighter">${stats.revenue.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 flex items-center mt-2 font-bold italic">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +12.5% vs Last Period
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Tenants</CardTitle>
            <Users className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800 tracking-tighter">{stats.tenants}</div>
            <p className="text-xs text-slate-400 mt-2 font-medium">98% Occupancy Rate</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest">Properties</CardTitle>
            <Building2 className="w-5 h-5 text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800 tracking-tighter">{stats.properties}</div>
            <p className="text-xs text-slate-400 mt-2 font-medium">Across Managed Units</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-rose-50 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black text-rose-600 uppercase tracking-widest">Risk Alerts</CardTitle>
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-rose-700 tracking-tighter">{stats.alerts}</div>
            <p className="text-xs text-rose-500 mt-2 font-bold italic flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Action Critical
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-border shadow-xl bg-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardHeader>
            <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Revenue Trajectory</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="h-[240px] flex items-end gap-3 px-2">
              {[40, 60, 45, 90, 65, 80, 50, 70, 85, 95, 75, 80].map((h, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-primary/10 hover:bg-primary/40 transition-all cursor-pointer rounded-t-2xl group relative"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all font-black">
                    ${(h * 100).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-8 text-[10px] text-slate-400 px-2 font-black tracking-[0.2em] uppercase">
              <span>Q1 Trends</span>
              <span>Mid-Year Analysis</span>
              <span>Q4 Estimates</span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-border shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Critical Actions</CardTitle>
            <Link href="/risk-alerts" className="text-xs font-black text-primary hover:underline uppercase tracking-widest italic">Hub View</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-10 italic font-medium">No critical alerts detected.</p>
              ) : (
                recentAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    onClick={() => handleTakeAction(alert)}
                    className="flex flex-col gap-3 p-5 rounded-2xl bg-slate-50 border border-transparent hover:border-primary/20 hover:bg-white transition-all cursor-pointer group shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                       <Badge variant={alert.severity === "high" ? "danger" : "warning"}>
                         {alert.type.replace("_", " ")}
                       </Badge>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intervene</span>
                    </div>
                    <div>
                      <p className="text-base font-black text-slate-800 group-hover:text-primary transition-colors tracking-tight">{alert.tenant.name}</p>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">{alert.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
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
