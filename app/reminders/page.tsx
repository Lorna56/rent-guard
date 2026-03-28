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

async function getReminders() {
  return await db.query.reminders.findMany({
    orderBy: [desc(reminders.scheduledAt)],
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
  const allReminders = await getReminders();

  return (
    <div className="space-y-8 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <Bell className="text-indigo-400" />
            Automated Reminders
          </h2>
          <p className="text-slate-400">Streamline rent collection with scheduled SMS and email notifications.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-semibold hover:bg-white/10 transition-all">
          <Settings className="w-4 h-4" />
          Reminder Settings
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-indigo-600/5 border-indigo-500/10">
          <CardHeader>
            <CardTitle className="text-sm text-slate-400">Next Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-indigo-400" />
              <p className="text-lg font-bold text-white">Tomorrow, 09:00 AM</p>
            </div>
            <p className="text-xs text-slate-500 mt-2">12 reminders queued</p>
          </CardContent>
        </Card>

        <Card className="bg-emerald-600/5 border-emerald-500/10">
          <CardHeader>
            <CardTitle className="text-sm text-slate-400">Sent (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <p className="text-lg font-bold text-white">142 Reminders</p>
            </div>
            <p className="text-xs text-emerald-400 mt-2">98% delivery rate</p>
          </CardContent>
        </Card>

        <Card className="bg-rose-600/5 border-rose-500/10">
          <CardHeader>
            <CardTitle className="text-sm text-slate-400">Delivery Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <p className="text-lg font-bold text-white">3 Failed</p>
            </div>
            <p className="text-xs text-rose-400 mt-2">Action required</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Queue & History</h3>
          <div className="flex gap-2">
             <Badge variant="outline">All Channels</Badge>
             <Badge variant="outline">Sent</Badge>
             <Badge variant="outline">Pending</Badge>
          </div>
        </div>

        {allReminders.length === 0 ? (
          <Card className="py-12 text-center text-slate-500">
             <p>No reminders scheduled yet.</p>
             <button className="mt-4 text-indigo-400 hover:underline">Configure Automation</button>
          </Card>
        ) : (
          allReminders.map((reminder) => (
            <Card key={reminder.id} className="group border-white/5 hover:border-indigo-500/20">
              <CardContent className="p-6">
                 <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="flex items-center gap-4">
                     <div className={cn(
                       "w-10 h-10 rounded-full flex items-center justify-center",
                       reminder.type === "email" ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"
                     )}>
                       {reminder.type === "email" ? <Mail className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                     </div>
                     <div>
                       <h4 className="text-sm font-bold text-white">
                         {reminder.type === "email" ? "Payment Reminder Email" : "Overdue SMS Notice"}
                       </h4>
                       <p className="text-xs text-slate-400">{reminder.lease.tenant.name} · {reminder.lease.property.name}</p>
                     </div>
                   </div>

                   <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-xs text-slate-500 flex items-center justify-end gap-1 mb-1">
                          <Clock className="w-3 h-3" />
                          {new Date(reminder.scheduledAt).toLocaleDateString()}
                        </p>
                        <Badge variant={reminder.status === "sent" ? "success" : "warning"}>
                          {reminder.status.toUpperCase()}
                        </Badge>
                      </div>
                      <button className="p-2 bg-white/5 border border-white/5 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-all">
                        <Send className="w-4 h-4" />
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
