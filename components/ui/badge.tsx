import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "outline";
}

export function Badge({ children, variant = "default", className, ...props }: BadgeProps) {
  const variants = {
    default: "bg-primary/10 text-primary border border-primary/20",
    success: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-sm",
    warning: "bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-sm",
    danger: "bg-rose-500/10 text-rose-600 border border-rose-500/20 shadow-sm",
    outline: "bg-transparent border border-border text-slate-500",
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide",
        variants[variant],
        className
      )} 
      {...props}
    >
      {children}
    </span>
  );
}
