"use client";

import { X, User, Mail, Phone, Home, Calendar, ShieldCheck, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: { id: number; name: string }[];
}

export function AddTenantModal({ isOpen, onClose, properties }: AddTenantModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyId: "",
    rentAmount: "",
    startDate: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate database update
    console.log("Saving tenant:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl border border-white overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-[50px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between border-b border-slate-50 relative z-10">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Add New Tenant</h3>
            <p className="text-sm font-medium text-slate-500">Step {step} of 2: {step === 1 ? 'Personal Details' : 'Lease Terms'}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-slate-100 text-slate-400 hover:text-rose-500 rounded-2xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-slate-100 w-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 relative z-10">
          {step === 1 ? (
            <div className="space-y-4 animate-in slide-in-from-right duration-300">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Legal Full Name</label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Michael Jordan"
                    className="w-full bg-slate-50 border border-border rounded-xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-inner"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="email" 
                      required
                      placeholder="mike@example.com"
                      className="w-full bg-slate-50 border border-border rounded-xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-inner"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="tel" 
                      required
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-slate-50 border border-border rounded-xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-inner"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in slide-in-from-right duration-300">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Assign Property</label>
                <div className="relative">
                  <Home className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select 
                    required
                    className="w-full bg-slate-50 border border-border rounded-xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-inner appearance-none"
                    value={formData.propertyId}
                    onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                  >
                    <option value="">Select a property...</option>
                    {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Monthly Rent ($)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="1,200.00"
                    className="w-full bg-slate-50 border border-border rounded-xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-inner"
                    value={formData.rentAmount}
                    onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Lease Start Date</label>
                  <div className="relative">
                    <Calendar className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="date" 
                      required
                      className="w-full bg-slate-50 border border-border rounded-xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-inner"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-6 flex gap-3">
            {step === 2 && (
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
              >
                Back
              </button>
            )}
            <button 
              type={step === 1 ? "button" : "submit"}
              onClick={step === 1 ? () => setStep(2) : undefined}
              className="flex-[2] py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:translate-y-[-2px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group uppercase tracking-widest text-xs"
            >
              {step === 1 ? 'Next Step' : 'Confirm & Save'}
              {step === 1 && <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />}
              {step === 2 && <ShieldCheck className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
