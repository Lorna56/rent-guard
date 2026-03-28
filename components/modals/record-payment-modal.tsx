"use client";

import { X, DollarSign, Calendar, CreditCard, User, Building2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenants: { id: number; name: string; leases: { id: number; property: { name: string } }[] }[];
}

export function RecordPaymentModal({ isOpen, onClose, tenants }: RecordPaymentModalProps) {
  const [formData, setFormData] = useState({
    tenantId: "",
    amount: "",
    paidAt: new Date().toISOString().split('T')[0],
    method: "bank_transfer",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Recording payment:", formData);
    onClose();
  };

  const selectedTenant = tenants.find(t => t.id === Number(formData.tenantId));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-white overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="absolute top-0 left-0 w-40 h-40 bg-emerald-500/5 blur-[50px] rounded-full -translate-y-1/2 -translate-x-1/2" />
        
        <div className="px-8 pt-8 pb-6 flex items-center justify-between border-b border-slate-50 relative z-10">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20">
               <DollarSign className="w-6 h-6" />
             </div>
             <div>
               <h3 className="text-2xl font-black text-slate-800 tracking-tight">Record Payment</h3>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest italic mt-0.5">Financial Transaction</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-slate-100 text-slate-400 hover:text-rose-500 rounded-2xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Select Resident</label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select 
                required
                className="w-full bg-slate-50 border border-border rounded-xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all shadow-inner appearance-none"
                value={formData.tenantId}
                onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
              >
                <option value="">Search residents...</option>
                {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            {selectedTenant && (
              <p className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1.5 mt-1 ml-1 animate-in fade-in slide-in-from-left-2 transition-all">
                <Building2 className="w-3 h-3" />
                Active Property: {selectedTenant.leases[0]?.property.name || "N/A"}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Payment Amount ($)</label>
              <div className="relative">
                <DollarSign className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="number" 
                  required
                  placeholder="0.00"
                  className="w-full bg-slate-50 border border-border rounded-xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all shadow-inner"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Payment Date</label>
              <div className="relative">
                <Calendar className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="date" 
                  required
                  className="w-full bg-slate-50 border border-border rounded-xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all shadow-inner"
                  value={formData.paidAt}
                  onChange={(e) => setFormData({ ...formData, paidAt: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "bank_transfer", label: "Bank Transfer" },
                { id: "credit_card", label: "Credit Card" },
                { id: "cash", label: "Cash / Cheque" },
                { id: "m-pesa", label: "Mobile Money" }
              ].map(method => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, method: method.id })}
                  className={cn(
                    "p-4 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 uppercase tracking-wide",
                    formData.method === method.id 
                      ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20 translate-y-[-1px]" 
                      : "bg-slate-50 border-transparent text-slate-500 hover:bg-white hover:border-border"
                  )}
                >
                  <CreditCard className="w-4 h-4" />
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-emerald-500 text-white rounded-[1.25rem] font-black shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:translate-y-[-2px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group uppercase tracking-[0.2em] text-xs"
          >
            Confirm Transaction
            <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}
