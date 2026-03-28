import { 
  Users, 
  Building2, 
  CreditCard, 
  AlertTriangle, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { tenants, payments, riskAlerts, properties } from "@/lib/db/schema";
import { count, sum, eq, desc } from "drizzle-orm";
import Link from "next/link";
import { cn } from "@/lib/utils";

async function getStats() {
  const [tenantCount] = await db.select({ value: count() }).from(tenants);
  const [propertyCount] = await db.select({ value: count() }).from(properties);
  const [totalRevenue] = await db.select({ value: sum(payments.amount) }).from(payments).where(eq(payments.status, "paid"));
  const [activeAlerts] = await db.select({ value: count() }).from(riskAlerts);

  return {
    tenants: tenantCount.value || 0,
    properties: propertyCount.value || 0,
    revenue: parseFloat(totalRevenue.value || "0"),
    alerts: activeAlerts.value || 0,
  };
}

async function getRecentAlerts() {
  return await db.query.riskAlerts.findMany({
    limit: 5,
    orderBy: [desc(riskAlerts.createdAt)],
    with: {
      tenant: true,
    },
  });
}

export default async function DashboardPage() {
  const stats = await getStats();
  const alerts = await getRecentAlerts();

  return (
    <div className="space-y-8 animate-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Portfolio Overview</h2>
        <p className="text-slate-400">Welcome back. Here's what's happening across your properties.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Revenue</CardTitle>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
            <p className="text-xs text-emerald-400 flex items-center mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500">Active Tenants</CardTitle>
            <Users className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800 tracking-tight">{stats.tenants}</div>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              98% occupancy rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500">Properties</CardTitle>
            <Building2 className="w-5 h-5 text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800 tracking-tight">{stats.properties}</div>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Across 3 locations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500">Risk Alerts</CardTitle>
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800 tracking-tight">{stats.alerts}</div>
            <p className="text-xs text-rose-500 flex items-center mt-1 font-bold">
              <TrendingUp className="w-3 h-3 mr-1" />
              Action required
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-none shadow-xl bg-gradient-to-br from-white to-secondary/30">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800">Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] flex items-end gap-3 px-2">
              {[40, 60, 45, 90, 65, 80, 50, 70, 85, 95, 75, 80].map((h, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-primary/20 hover:bg-primary/50 transition-all cursor-pointer rounded-t-xl group relative"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    ${(h * 100).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6 text-xs text-slate-400 px-2 font-bold tracking-widest uppercase">
              <span>Jan</span>
              <span>Jun</span>
              <span>Dec</span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-800">Critical Alerts</CardTitle>
            <Link href="/risk-alerts" className="text-xs font-bold text-primary hover:underline">View All</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No critical alerts detected.</p>
              ) : (
                alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-border hover:border-primary/20 transition-all cursor-pointer group">
                    <div className={cn(
                      "mt-1.5 w-2.5 h-2.5 rounded-full",
                      alert.severity === "high" ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" : "bg-amber-500"
                    )} />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">{alert.tenant.name}</p>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">{alert.message}</p>
                      <Badge variant={alert.severity === "high" ? "danger" : "warning"} className="mt-2">
                        {alert.type.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
