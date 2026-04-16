"use client";

import Link from "next/link";
import { Shield, ArrowRight, User, Mail, Lock, Building2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/app/api/actions/auth";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    propertyCount: "",
    password: "",
  });
  const router = useRouter();

  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const passwordStrength = useMemo(() => {
    const pass = formData.password;
    if (!pass) return { score: 0, label: "None", color: "bg-slate-200" };
    
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score < 2) return { score, label: "Weak", color: "bg-red-500" };
    if (score === 2) return { score, label: "Fair", color: "bg-amber-500" };
    if (score === 3) return { score, label: "Good", color: "bg-blue-500" };
    return { score, label: "Strong", color: "bg-emerald-500" };
  }, [formData.password]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (passwordStrength.score < 3) {
      setError("Please use a stronger password");
      return;
    }

    setIsPending(true);
    const result = await signup(formData);
    setIsPending(false);

    if (result.error) {
      setError(result.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-accent/20 flex items-center justify-center p-6 bg-gradient-to-br from-background via-secondary to-accent">
      <div className="w-full max-w-lg space-y-8 glass p-10 rounded-[2.5rem] border border-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="text-center relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-8 hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 text-white">
              <Shield className="w-8 h-8" />
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tighter">RentGuard</span>
          </Link>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create My Account</h2>
          <p className="text-slate-500 font-medium mt-2">The first step to smarter property management</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  required
                  placeholder="Lorna Majesty"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/70 border border-border rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email" 
                  required
                  placeholder="landlord@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/70 border border-border rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Number of Properties</label>
            <div className="relative">
              <Building2 className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select 
                required
                value={formData.propertyCount}
                onChange={(e) => setFormData({ ...formData, propertyCount: e.target.value })}
                className="w-full bg-white/70 border border-border rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
              >
                <option value="">Select your portfolio size...</option>
                <option value="1-5">1-5 Properties</option>
                <option value="6-20">6-20 Properties</option>
                <option value="21-100">21-100 Properties</option>
                <option value="100+">100+ Properties</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Secure Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="password" 
                required
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white/70 border border-border rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            
            {formData.password && (
              <div className="mt-2 px-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Strength: {passwordStrength.label}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div 
                        key={i} 
                        className={`h-1 w-6 rounded-full transition-colors ${i <= passwordStrength.score ? passwordStrength.color : 'bg-slate-200'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="pt-4">
            <button 
              type="submit"
              disabled={isPending}
              className="w-full py-5 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/25 hover:translate-y-[-2px] hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Creating Account..." : "Sign Up For Free"}
              {!isPending && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </form>

        <div className="text-center pt-2 relative z-10">
          <p className="text-sm text-slate-500 font-medium">
            Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
