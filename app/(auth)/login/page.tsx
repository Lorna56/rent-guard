"use client";

import Link from "next/link";
import { Shield, ArrowRight, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would handle auth. For this demo, we'll just redirect to dashboard.
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-accent/20 flex items-center justify-center p-6 bg-gradient-to-br from-background via-secondary to-accent">
      <div className="w-full max-w-md space-y-8 glass p-10 rounded-[2.5rem] border border-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="text-center relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-8 hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 text-white">
              <Shield className="w-8 h-8" />
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tighter">RentGuard</span>
          </Link>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 font-medium mt-2">Secure access to your management dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="landlord@example.com"
                className="w-full bg-white/70 border border-border rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <Link href="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/70 border border-border rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/25 hover:translate-y-[-2px] hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            Access Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="text-center pt-4 relative z-10">
          <p className="text-sm text-slate-500 font-medium">
            New to RentGuard? <Link href="/signup" className="text-primary font-bold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
