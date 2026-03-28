import Link from "next/link";
import { 
  Shield, 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  Users, 
  Bell
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-border/50 bg-white/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 text-white">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">RentGuard</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#security" className="hover:text-primary transition-colors">Security</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Sign In</Link>
            <Link 
              href="/signup" 
              className="px-6 py-2.5 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 text-accent-foreground text-sm font-bold animate-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Securing 10,000+ Units Nationwide
          </div>
          
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tighter text-slate-900 leading-tight">
            Protect Your Income With <br />
            <span className="text-primary italic">Intelligence</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
            The next generation of property management. Detect tenant risks before they become problems with automated monitoring and AI-driven behavior analysis.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/signup" 
              className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-[2rem] text-lg font-bold shadow-xl shadow-primary/25 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3 group"
            >
              Start Protecting My Property
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/dashboard" 
              className="w-full sm:w-auto px-10 py-5 bg-secondary text-secondary-foreground rounded-[2rem] text-lg font-bold border border-primary/10 hover:bg-white transition-all flex items-center justify-center gap-2"
            >
              Explore Dashboard
            </Link>
          </div>

          <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            {/* Trust Logos Placeholder */}
            <div className="flex items-center justify-center font-bold text-2xl text-slate-400">Forbes</div>
            <div className="flex items-center justify-center font-bold text-2xl text-slate-400">Wired</div>
            <div className="flex items-center justify-center font-bold text-2xl text-slate-400">TechCrunch</div>
            <div className="flex items-center justify-center font-bold text-2xl text-slate-400">Fortune</div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 bg-accent/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-slate-900">Why Modern Landlords Choose Us</h2>
            <p className="text-slate-500 font-medium">Built for safety, streamlined for efficiency.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Shield className="w-8 h-8 text-primary" />}
              title="Risk Detection"
              description="Our engine analyzes payment patterns to flag high-risk behavior before it escalates."
            />
            <FeatureCard 
              icon={<BarChart3 className="w-8 h-8 text-sky-500" />}
              title="Automated Tracking"
              description="Forget spreadsheets. Track every payment, lease, and tenant in one cohesive dashboard."
            />
            <FeatureCard 
              icon={<Bell className="w-8 h-8 text-pink-500" />}
              title="Smart Reminders"
              description="Automated SMS and email reminders based on custom risk profiles and due dates."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-900">
              <Shield className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900">RentGuard</span>
          </div>
          <div className="text-sm font-medium text-slate-400">
            © 2026 RentGuard. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm font-bold text-slate-500">
            <Link href="#" className="hover:text-primary">Privacy</Link>
            <Link href="#" className="hover:text-primary">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-[2rem] bg-white border border-border shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{description}</p>
      <div className="mt-6 flex items-center gap-2 text-sm font-bold text-primary cursor-pointer group">
        Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}
