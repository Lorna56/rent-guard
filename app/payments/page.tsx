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
    <div className="space-y-8 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Payment Tracking</h2>
          <p className="text-slate-400">Monitor all rental transactions and overdue accounts.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-all font-medium text-slate-300">
            Export History
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all">
            Record Payment
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-emerald-500/5 border-emerald-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-emerald-400">Collected (MTD)</p>
              <ArrowUpRight className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-white">$24,500.00</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-amber-400">Pending</p>
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-3xl font-bold text-white">$4,200.00</p>
          </CardContent>
        </Card>
        <Card className="bg-rose-500/5 border-rose-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-rose-400">Overdue</p>
              <AlertCircle className="w-5 h-5 text-rose-400" />
            </div>
            <p className="text-3xl font-bold text-white">$1,850.00</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search payments by tenant, property or invoice ID..." 
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-xs text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tenant</th>
                <th className="px-6 py-4">Property</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-white/[0.02]">
              {allPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">No payment records found.</td>
                </tr>
              ) : (
                allPayments.map((payment) => (
                  <tr key={payment.id} className="group hover:bg-white/5 transition-all">
                    <td className="px-6 py-4">
                      <Badge 
                        variant={
                          payment.status === "paid" ? "success" : 
                          payment.status === "late" ? "danger" : "warning"
                        }
                      >
                        {payment.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white tracking-tight">{payment.lease.tenant.name}</span>
                        <span className="text-xs text-slate-500">{payment.lease.tenant.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300">{payment.lease.property.name}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm font-bold text-indigo-400">
                      ${parseFloat(payment.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-400">{new Date(payment.dueDate).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest">
                        Details
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
