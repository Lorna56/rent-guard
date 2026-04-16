import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Settings,
  Send
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { reminders } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { cn } from "@/lib/utils";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { tenants, leases } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";

async function getReminders(landlordId: number) {
  return await db.query.reminders.findMany({
    orderBy: [desc(reminders.scheduledAt)],
    where: inArray(reminders.leaseId, db.select({ id: leases.id }).from(leases).innerJoin(tenants, eq(leases.tenantId, tenants.id)).where(eq(tenants.landlordId, landlordId))),
    with: {
      lease: {
        with: {
          tenant: true,
          property: true,
        }
      }
    }
  });
}

export default async function RemindersPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const landlordId = session.user.id;
  const allReminders = await getReminders(landlordId);

  return (
    <div className="space-y-8 animate-in text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight mb-2 flex items-center gap-3 text-slate-800">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Bell className="text-primary w-8 h-8" />
            </div>
            Automated Reminders
          </h2>
          <p className="text-slate-500 font-medium">Streamline rent collection with scheduled SMS and email notifications.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-border rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
          <Settings className="w-5 h-5" />
          Automation Settings
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-secondary border-primary/20 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black text-primary uppercase tracking-[0.2em]">Next Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary" />
              <p className="text-xl font-black text-slate-800 tracking-tight">Tomorrow, 09:00 AM</p>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-bold uppercase italic tracking-wider">12 reminders queued</p>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50 border-emerald-200 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em]">Sent (Monthly)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              <p className="text-xl font-black text-slate-800 tracking-tight">142 Reminders</p>
            </div>
            <p className="text-xs text-emerald-600 mt-2 font-bold uppercase italic tracking-wider">98% delivery rate</p>
          </CardContent>
        </Card>

        <Card className="bg-rose-50 border-rose-200 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black text-rose-600 uppercase tracking-[0.2em]">Failed / Bounced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-rose-500" />
              <p className="text-xl font-black text-slate-800 tracking-tight">3 Delivery Failures</p>
            </div>
            <p className="text-xs text-rose-600 mt-2 font-bold uppercase italic tracking-wider">Manual Action required</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-800 tracking-tighter uppercase italic">Queue & History</h3>
          <div className="flex gap-2">
             <Badge variant="outline" className="bg-white">All Channels</Badge>
             <Badge variant="outline" className="bg-white">Sent</Badge>
             <Badge variant="outline" className="bg-white">Pending</Badge>
          </div>
        </div>

        {allReminders.length === 0 ? (
          <Card className="py-20 text-center text-slate-500 border-dashed border-2 bg-slate-50/50">
             <p className="font-bold">No reminders scheduled yet.</p>
             <button className="mt-4 text-primary font-bold hover:underline">Configure Automation</button>
          </Card>
        ) : (
          allReminders.map((reminder) => (
            <Card key={reminder.id} className="group border-border hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden">
              <CardContent className="p-6 relative">
                 {reminder.status === "sent" && <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />}
                 {reminder.status === "pending" && <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />}
                 
                 <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm",
                        reminder.type === "email" ? "bg-sky-100 text-sky-600" : "bg-primary/10 text-primary"
                      )}>
                        {reminder.type === "email" ? <Mail className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="text-base font-black text-slate-800 tracking-tight">
                          {reminder.type === "email" ? "Automatic Payment Request" : "Urgent Late Payment SMS"}
                        </h4>
                        <p className="text-sm font-medium text-slate-500 italic uppercase tracking-wider text-[10px]">
                          {reminder.lease.tenant.name} · {reminder.lease.property.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-10">
                       <div className="text-right">
                         <p className="text-[10px] font-black text-slate-400 flex items-center justify-end gap-1.5 mb-1.5 uppercase tracking-widest">
                           <Clock className="w-3.5 h-3.5" />
                           {new Date(reminder.scheduledAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                         </p>
                         <Badge variant={reminder.status === "sent" ? "success" : "warning"}>
                           {reminder.status?.toUpperCase() || "PENDING"}
                         </Badge>
                       </div>
                       <button className="p-3 bg-white border border-border rounded-[1.25rem] text-slate-400 hover:text-primary hover:border-primary/30 transition-all shadow-sm group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/20">
                         <Send className="w-5 h-5" />
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
