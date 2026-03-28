"use client";

import { X, Send, Mail, MessageSquare, AlertTriangle, ShieldCheck, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TakeActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: { id: number; name: string; email: string; phone: string };
  alertType: string;
}

export function TakeActionModal({ isOpen, onClose, tenant, alertType }: TakeActionModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [actionType, setActionType] = useState<'email' | 'sms' | 'both'>('both');
  const [customMessage, setCustomMessage] = useState(
    `Urgent: We've detected consecutive payment delays for your lease. Please contact management immediately to avoid further action.`
  );

  if (!isOpen && !success) return null;

  const handleSend = async () => {
    setLoading(true);
    try {
      // Simulate real-time API call
      const response = await fetch('/api/actions/send-notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: tenant.id,
          to: actionType === 'email' ? tenant.email : tenant.phone,
          message: customMessage,
          type: actionType,
          alertType
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
      }
    } catch (error) {
       console.error("Action failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 min-h-screen">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-white overflow-hidden animate-in fade-in zoom-in duration-300">
        {success ? (
          <div className="p-12 text-center space-y-4">
             <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
               <CheckCircle2 className="w-10 h-10 text-white" />
             </div>
             <h3 className="text-2xl font-black text-slate-800">Notice Dispatched!</h3>
             <p className="text-slate-500 font-medium tracking-tight italic">Redirecting to Intelligence Hub...</p>
          </div>
        ) : (
          <>
            <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/10 blur-[50px] rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="px-8 pt-8 pb-4 flex items-center justify-between border-b border-slate-50 relative z-10">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-500/20">
                   <AlertTriangle className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="text-2xl font-black text-slate-800 tracking-tight">Rapid Response</h3>
                   <p className="text-xs font-bold text-rose-500 uppercase tracking-widest italic mt-0.5">High Risk Intervention</p>
                 </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-slate-100 text-slate-400 hover:text-rose-500 rounded-2xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6 relative z-10">
              <div className="p-4 bg-slate-50 rounded-2xl border border-border">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Target Resident</p>
                <p className="text-lg font-black text-slate-800 tracking-tight">{tenant.name}</p>
                <div className="flex gap-4 mt-2">
                   <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                     <Mail className="w-3.5 h-3.5 text-primary" />
                     {tenant.email}
                   </div>
                   <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                     <MessageSquare className="w-3.5 h-3.5 text-primary" />
                     {tenant.phone}
                   </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Response Strategy</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'email', icon: Mail, label: 'Email' },
                    { id: 'sms', icon: MessageSquare, label: 'SMS' },
                    { id: 'both', icon: ShieldCheck, label: 'Both' }
                  ].map(type => (
                    <button
                      key={type.id}
                      onClick={() => setActionType(type.id as any)}
                      className={cn(
                        "p-4 rounded-xl border flex flex-col items-center gap-2 transition-all",
                        actionType === type.id 
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.05]" 
                          : "bg-slate-50 border-transparent text-slate-400 hover:bg-white hover:border-border"
                      )}
                    >
                      <type.icon className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Draft Intervention Message</label>
                <textarea 
                  className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm font-bold min-h-[120px] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner leading-relaxed"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                />
              </div>

              <button 
                onClick={handleSend}
                disabled={loading}
                className="w-full py-5 bg-rose-500 text-white rounded-[1.25rem] font-black shadow-xl shadow-rose-500/20 hover:shadow-rose-500/40 hover:translate-y-[-2px] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group uppercase tracking-[0.2em] text-xs disabled:opacity-50 disabled:translate-y-0"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Execute Action
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
