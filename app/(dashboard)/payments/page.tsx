import { 
  CreditCard, 
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

async function getPayments() {
  return await db.query.payments.findMany({
    orderBy: [desc(payments.dueDate)],
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

export default async function PaymentsPage() {
  const allPayments = await getPayments();

  return (
    <div className="space-y-8 animate-in text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-800">Payment Tracking</h2>
          <p className="text-slate-500 font-medium mt-1">Monitor all rental transactions and overdue accounts.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-border rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            Export Report
          </button>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:translate-y-[-2px] active:scale-[0.98] transition-all">
            Record Payment
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-emerald-50 border-emerald-100 shadow-sm transition-transform hover:scale-[1.02]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Collected (MTD)</p>
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <ArrowUpRight className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-3xl font-black text-emerald-700 tracking-tighter">$24,500.00</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-100 shadow-sm transition-transform hover:scale-[1.02]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-amber-600 uppercase tracking-widest">Pending</p>
              <div className="p-2 bg-amber-500/10 rounded-xl">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-3xl font-black text-amber-700 tracking-tighter">$4,200.00</p>
          </CardContent>
        </Card>
        <Card className="bg-rose-50 border-rose-100 shadow-sm transition-transform hover:scale-[1.02]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-rose-600 uppercase tracking-widest">Overdue</p>
              <div className="p-2 bg-rose-500/10 rounded-xl">
                <AlertCircle className="w-5 h-5 text-rose-600" />
              </div>
            </div>
            <p className="text-3xl font-black text-rose-700 tracking-tighter">$1,850.00</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search payments by tenant, property or invoice ID..." 
            className="w-full bg-white border border-border rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>

        <div className="rounded-[2rem] border border-border overflow-hidden bg-white shadow-xl">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Resident</th>
                <th className="px-8 py-5">Property</th>
                <th className="px-8 py-5 text-right">Amount</th>
                <th className="px-8 py-5">Due Date</th>
                <th className="px-8 py-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold italic">No payment records found.</td>
                </tr>
              ) : (
                allPayments.map((payment) => (
                  <tr key={payment.id} className="group hover:bg-accent/30 transition-all cursor-pointer">
                    <td className="px-8 py-6">
                      <Badge 
                        variant={
                          payment.status === "paid" ? "success" : 
                          payment.status === "late" ? "danger" : "warning"
                        }
                      >
                        {payment.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800 tracking-tight group-hover:text-primary transition-colors">{payment.lease.tenant.name}</span>
                        <span className="text-xs text-slate-400 font-medium">{payment.lease.tenant.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-slate-600">{payment.lease.property.name}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-sm font-black text-slate-800 italic">
                        ${parseFloat(payment.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none bg-slate-100 px-3 py-1.5 rounded-lg border border-border/50">
                        {new Date(payment.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button className="px-4 py-2 text-xs font-black text-primary hover:bg-primary/5 rounded-xl border border-primary/20 transition-all uppercase tracking-widest shadow-sm">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
