import { createElement } from "react";

// Shared Admin visual primitives. Presentation only — every component takes
// plain props, makes no API calls, and changes no behavior. All colors come
// from the semantic theme tokens (bg/surface/ink/muted/primary/accent) plus
// restrained Tailwind status tones, so light + dark mode keep working.

export function Card({ className = "", children }) {
  return (
    <div className={`bg-surface rounded-2xl border border-border overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ className = "", children }) {
  return <div className={`p-5 sm:p-6 ${className}`}>{children}</div>;
}

// KPI card: label, prominent value, icon chip, one-line sub note.
// Mirrors the reference dashboard stat cards.
export function StatCard({ label, value, sub, icon: Icon, iconTone = "green" }) {
  const tones = {
    green: "bg-primary/10 text-primary",
    amber: "bg-accent-soft/30 text-accent dark:bg-amber-500/15 dark:text-amber-300",
    red: "bg-red-500/10 text-red-600 dark:text-red-400",
    neutral: "bg-surface-soft text-muted",
  };
  return (
    <div className="bg-surface rounded-2xl border border-border p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-muted text-sm">{label}</p>
        {Icon && (
          <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${tones[iconTone] || tones.green}`}>
            {createElement(Icon, { size: 15 })}
          </span>
        )}
      </div>
      <p className="font-display text-3xl font-semibold text-ink mt-1">{value}</p>
      {sub && <p className="text-xs text-muted mt-1.5">{sub}</p>}
    </div>
  );
}

// Restrained status pill. tone: success | warning | danger | neutral
export function Badge({ tone = "neutral", children }) {
  const tones = {
    success: "bg-primary/10 text-primary",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200",
    danger: "bg-red-500/10 text-red-600 dark:text-red-400",
    neutral: "bg-surface-soft text-muted",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${tones[tone] || tones.neutral}`}>
      {children}
    </span>
  );
}

export function PrimaryButton({ className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

export function GhostButton({ className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-muted hover:bg-surface-soft hover:text-ink transition-colors disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

export function EmptyState({ icon: Icon, title, hint, action }) {
  return (
    <div className="p-12 flex flex-col items-center text-center">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-accent-soft/40 flex items-center justify-center mb-3">
          {createElement(Icon, { size: 20, className: "text-accent" })}
        </div>
      )}
      <p className="font-display font-semibold text-ink text-lg">{title}</p>
      {hint && <p className="text-muted text-sm mt-1 max-w-sm">{hint}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function LoadingRows({ count = 3, className = "" }) {
  return (
    <div className={`p-8 space-y-3 ${className}`} aria-label="Loading">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="h-14 rounded-xl bg-surface-soft animate-pulse" />
      ))}
    </div>
  );
}

// Horizontal scroll wrapper that keeps wide tables usable on small screens
// without letting the page itself overflow.
export function TableScroll({ children }) {
  return <div className="overflow-x-auto">{children}</div>;
}

export function FieldInput({ className = "", ...props }) {
  return (
    <input
      className={`w-full px-4 py-2.5 rounded-xl bg-surface-soft text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 ${className}`}
      {...props}
    />
  );
}

export function FieldSelect({ className = "", children, ...props }) {
  return (
    <select
      className={`px-4 py-2.5 rounded-xl bg-surface-soft text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function FieldLabel({ children }) {
  return (
    <label className="block text-sm font-medium text-ink mb-1.5">
      {children}
    </label>
  );
}
