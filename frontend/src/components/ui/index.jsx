import React from 'react'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'

// ── Button ──────────────────────────────────────────────────
export function Button({ variant = 'primary', size = 'md', children, className, loading, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-display font-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-gradient-brand text-white shadow-[0_8px_32px_rgba(124,92,255,0.4)] hover:shadow-[0_12px_48px_rgba(124,92,255,0.6)] rounded-xl border border-white/10',
    secondary: 'bg-white/5 border border-white/10 text-slate-300 rounded-xl hover:text-white hover:bg-white/10',
    ghost: 'text-slate-400 rounded-lg hover:text-white hover:bg-white/5',
    danger: 'bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20',
    success: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/20',
  }
  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-3.5 text-base',
    icon: 'p-2',
  }
  
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : children}
    </motion.button>
  )
}

// ── Card ──────────────────────────────────────────────────
export function Card({ children, className, hover = false, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 12px 48px rgba(124,92,255,0.2), 0 0 0 1px rgba(124,92,255,0.3)' } : {}}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={clsx('glass-card', className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// ── StatCard ──────────────────────────────────────────────
export function StatCard({ label, value, icon: Icon, delta, color = 'purple', className }) {
  const colors = {
    purple: 'from-brand-purple/20 to-transparent text-brand-violet',
    blue: 'from-brand-blue/20 to-transparent text-brand-blue',
    cyan: 'from-brand-cyan/20 to-transparent text-brand-cyan',
    emerald: 'from-emerald-500/20 to-transparent text-emerald-400',
  }
  return (
    <Card hover className={clsx('p-5 flex flex-col gap-3 group relative overflow-hidden', className)}>
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <div className="flex items-start justify-between relative z-10">
        <div className={clsx('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center border border-white/5', colors[color])}>
          <Icon className="w-6 h-6" />
        </div>
        {delta !== undefined && (
          <span className={clsx(
            'text-xs font-bold px-2 py-1 rounded-md tracking-wide',
            delta >= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
          )}>
            {delta >= 0 ? '+' : ''}{delta}%
          </span>
        )}
      </div>
      <div className="relative z-10 mt-2">
        <p className="text-3xl font-display font-800 text-white tracking-tight">{value}</p>
        <p className="text-sm font-medium text-slate-400 mt-1">{label}</p>
      </div>
    </Card>
  )
}

// ── Badge ──────────────────────────────────────────────────
export function Badge({ variant = 'default', children, className }) {
  const variants = {
    active: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
    upcoming: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
    completed: 'bg-slate-500/15 text-slate-400 border border-slate-500/20',
    featured: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
    review: 'bg-brand-violet/15 text-brand-violet border border-brand-violet/20',
    draft: 'bg-slate-600/20 text-slate-500 border border-slate-600/30',
    scored: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20',
    default: 'bg-dark-600/60 text-slate-400 border border-dark-500',
  }
  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider', variants[variant], className)}>
      {(variant === 'active') && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />}
      {children}
    </span>
  )
}

// ── Input ──────────────────────────────────────────────────
export function Input({ label, error, icon: Icon, className, ...props }) {
  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          className={clsx(
            'w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white',
            'placeholder:text-slate-400 outline-none transition-all duration-300 shadow-inner',
            'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/10 focus:scale-[1.01]',
            Icon && 'pl-11',
            error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30 animate-shake',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-medium text-red-400 mt-1.5">
          {error}
        </motion.p>
      )}
    </div>
  )
}

// ── Select ──────────────────────────────────────────────────
export function Select({ label, options = [], className, ...props }) {
  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">{label}</label>}
      <select
        className={clsx(
          'w-full bg-dark-800/50 backdrop-blur-sm border border-glass-border rounded-xl px-4 py-3.5 text-sm text-slate-200',
          'outline-none transition-all duration-200 cursor-pointer appearance-none',
          'focus:border-brand-violet/50 focus:ring-4 focus:ring-brand-violet/10 focus:bg-dark-700/80',
          className
        )}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-dark-800">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

// ── Progress Bar ──────────────────────────────────────────────────
export function ProgressBar({ value, max = 100, color = 'purple', className }) {
  const pct = Math.min(100, (value / max) * 100)
  const colors = {
    purple: 'from-brand-primary to-brand-accent',
    blue: 'from-brand-blue to-cyan-400',
    emerald: 'from-emerald-500 to-teal-400',
    gold: 'from-amber-400 to-orange-400',
  }
  return (
    <div className={clsx('h-1.5 bg-dark-700/50 rounded-full overflow-hidden border border-white/5', className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className={clsx('h-full rounded-full bg-gradient-to-r', colors[color])}
      />
    </div>
  )
}

// ── Empty State ──────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action, actionLabel }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-dark-800/50 backdrop-blur-md border border-glass-border flex items-center justify-center mb-5 shadow-glass">
        <Icon className="w-8 h-8 text-slate-500" />
      </div>
      <h3 className="font-display font-700 text-white text-lg mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">{description}</p>
      {action && (
        <Button onClick={action}>{actionLabel}</Button>
      )}
    </motion.div>
  )
}

// ── Section Header ──────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action, actionLabel, onAction }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="font-display font-800 text-white text-lg tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm font-medium text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {action && (
        <Button variant="ghost" size="sm" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  )
}

// ── Tag ──────────────────────────────────────────────────
export function Tag({ children }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-dark-700/50 border border-white/5 text-[10px] text-slate-400 font-bold uppercase tracking-wider hover:bg-dark-600/50 hover:text-white transition-colors cursor-default">
      {children}
    </span>
  )
}

// ── Divider ──────────────────────────────────────────────────
export function Divider({ className }) {
  return <div className={clsx('border-t border-glass-border', className)} />
}

// ── Avatar ──────────────────────────────────────────────────
export function Avatar({ name, size = 'md', className }) {
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'
  const sizes = { sm: 'w-8 h-8 text-[11px]', md: 'w-10 h-10 text-xs', lg: 'w-12 h-12 text-sm', xl: 'w-16 h-16 text-base' }
  return (
    <div className={clsx(
      'rounded-full bg-gradient-card border border-glass-border flex items-center justify-center font-display font-800 text-white flex-shrink-0 shadow-glass',
      sizes[size],
      className
    )}>
      {initials}
    </div>
  )
}

// ── FilterChip ──────────────────────────────────────────────────
export function FilterChip({ label, active, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={clsx(
        'px-4 py-2 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-200 whitespace-nowrap',
        active
          ? 'bg-brand-violet/10 text-brand-violet border border-brand-violet/30 shadow-[0_0_20px_rgba(124,92,255,0.1)]'
          : 'bg-dark-800/40 text-slate-500 border border-glass-border hover:text-slate-300 hover:bg-dark-700/50'
      )}
    >
      {label}
    </motion.button>
  )
}

// ── Skeleton ──────────────────────────────────────────────────
export function Skeleton({ className, variant = 'rect' }) {
  const variants = {
    rect: 'rounded-xl',
    circle: 'rounded-full',
    text: 'rounded h-4 w-3/4',
  }
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "linear", repeatType: "reverse" }}
      className={clsx(
        'bg-dark-700/40 border border-white/5',
        variants[variant],
        className
      )}
    />
  )
}
