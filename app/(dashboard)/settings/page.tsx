"use client";

import { 
  User, 
  Building, 
  Bell, 
  ShieldCheck, 
  CreditCard, 
  ChevronRight,
  LogOut,
  Save
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="space-y-8 animate-in text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-800">System Settings</h2>
          <p className="text-slate-500 font-medium mt-1">Configure your organization and management preferences.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:translate-y-[-2px] active:scale-[0.98] transition-all">
          <Save className="w-5 h-5" />
          Save All Changes
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3">
          <Card className="border-none shadow-xl bg-white/50 overflow-hidden">
            <CardContent className="p-2">
              {[
                { icon: User, label: "Organization Profile", count: "90%" },
                { icon: Bell, label: "Notification Rules", active: true },
                { icon: ShieldCheck, label: "Security & Access" },
                { icon: CreditCard, label: "Billing & Plans" },
              ].map((item, i) => (
                <button 
                  key={i}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${item.active ? 'bg-primary text-white shadow-lg' : 'hover:bg-accent text-slate-600'}`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-bold text-sm tracking-tight">{item.label}</span>
                  </div>
                  {item.count ? <span className="text-[10px] font-black opacity-60 uppercase">{item.count}</span> : <ChevronRight className="w-4 h-4 opacity-40 ml-2" />}
                </button>
              ))}
              <div className="mt-4 pt-4 border-t border-border">
                <button className="w-full flex items-center gap-3 p-4 text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                   <LogOut className="w-5 h-5" />
                   <span className="font-bold text-sm">Sign Out System</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Content */}
        <div className="lg:col-span-9 space-y-6">
          <Card className="border-border shadow-md">
            <CardHeader className="pb-0">
               <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Organization Profile</CardTitle>
               <p className="text-sm text-slate-500 font-medium">Update your managed portfolio information.</p>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Portfolio Name</label>
                  <input 
                    type="text" 
                    defaultValue="RentGuard Operations Ltd"
                    className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Contact Phone</label>
                  <input 
                    type="text" 
                    defaultValue="+1 (555) 489-0231"
                    className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-md overflow-hidden">
            <CardHeader className="pb-0">
               <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Notification Rules</CardTitle>
               <p className="text-sm text-slate-500 font-medium">Automate communication with your residents.</p>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {[
                { label: "Automatic Rent Reminders", desc: "Sent 3 days before due date", checked: true },
                { label: "High Risk Tenant Alerts", desc: "Notification upon credit score drop", checked: true },
                { label: "System Uptime & Health", desc: "Quarterly performance reports", checked: false },
              ].map((rule, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-primary/20 hover:bg-white transition-all">
                  <div>
                    <p className="text-sm font-black text-slate-800">{rule.label}</p>
                    <p className="text-xs text-slate-500 font-medium italic">{rule.desc}</p>
                  </div>
                  <button 
                    onClick={() => {}}
                    className={`w-12 h-6 rounded-full transition-all relative ${rule.checked ? 'bg-primary' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${rule.checked ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
