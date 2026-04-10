import React, { useId } from 'react'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'

// ── Button ──────────────────────────────────────────────────
export function Button({ variant = 'primary', size = 'md', children, className, loading, icon: Icon, type = 'button', disabled, ...props }) {
  const base = 'btn-premium'
  const variants = {
    primary: 'btn-premium-primary',
    secondary: 'btn-premium-secondary',
    ghost: 'text-slate-400 hover:text-white hover:bg-white/5 rounded-xl',
    danger: 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-xl',
    success: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 rounded-xl',
  }
  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
    icon: 'p-2.5',
  }
  
  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.96 }}
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4" />}
          {children}
        </>
      )}
    </motion.button>
  )
}

// ── Card ──────────────────────────────────────────────────
export function Card({ children, className, hover = false, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, border: '1px solid rgba(99, 102, 241, 0.3)' } : {}}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={clsx('glass-card p-6', className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// ── StatCard ──────────────────────────────────────────────
export function StatCard({ label, value, icon: Icon, delta, color = 'indigo', className }) {
  const colors = {
    indigo: 'from-indigo-500/20 to-transparent text-indigo-400 border-indigo-500/20',
    purple: 'from-purple-500/20 to-transparent text-purple-400 border-purple-500/20',
    blue: 'from-blue-500/20 to-transparent text-blue-400 border-blue-500/20',
    emerald: 'from-emerald-500/20 to-transparent text-emerald-400 border-emerald-500/20',
  }
  
  return (
    <Card hover className={clsx('relative group overflow-hidden', className)}>
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon size={80} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={clsx('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center border', colors[color])}>
            <Icon size={22} />
          </div>
          {delta !== undefined && (
            <div className={clsx(
              'flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg',
              (typeof delta === 'number' ? delta : parseFloat(delta)) >= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
            )}>
              {(typeof delta === 'number' ? delta : parseFloat(delta)) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(delta) || 0).toFixed(1)}%
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-3xl font-bold tracking-tight text-white">{value}</h3>
          <p className="text-sm font-medium text-slate-400 capitalize">{label}</p>
        </div>
      </div>
    </Card>
  )
}

// ── Badge ──────────────────────────────────────────────────
export function Badge({ variant = 'default', children, className }) {
  const variants = {
    active: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    upcoming: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    completed: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
    featured: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    review: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    draft: 'bg-slate-600/10 text-slate-500 border border-slate-600/20',
    scored: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    default: 'bg-white/5 text-slate-400 border border-white/10',
  }
  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider', variants[variant], className)}>
      {variant === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
      {children}
    </span>
  )
}

// ── Input ──────────────────────────────────────────────────
export function Input({ label, error, icon: Icon, className, ...props }) {
  const generatedId = useId()
  const inputId = props.id || generatedId
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <div className="space-y-1.5">
      {label && <label htmlFor={inputId} className="block text-xs font-semibold text-slate-400 ml-1">{label}</label>}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          id={inputId}
          className={clsx(
            'input-premium',
            Icon && 'pl-11',
            error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10 animate-shake',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={errorId}
          {...props}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            id={errorId}
            className="text-[11px] font-medium text-red-400 ml-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Select ──────────────────────────────────────────────────
export function Select({ label, options = [], className, ...props }) {
  const generatedId = useId()
  const selectId = props.id || generatedId

  return (
    <div className="space-y-1.5">
      {label && <label htmlFor={selectId} className="block text-xs font-semibold text-slate-400 ml-1">{label}</label>}
      <select
        id={selectId}
        className={clsx(
          'input-premium cursor-pointer appearance-none',
          className
        )}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

// ── Progress Bar ──────────────────────────────────────────────────
export function ProgressBar({ value, max = 100, color = 'indigo', className }) {
  const safeValue = Number(value) || 0;
  const safeMax = Number(max) || 0;
  const pct = safeMax > 0 ? Math.min(100, (safeValue / safeMax) * 100) : 0;
  const colors = {
    indigo: 'from-indigo-500 to-purple-500',
    purple: 'from-purple-500 to-pink-500',
    blue: 'from-blue-500 to-indigo-500',
    emerald: 'from-emerald-500 to-teal-500',
  }
  return (
    <div className={clsx('h-2 bg-white/5 rounded-full overflow-hidden border border-white/5', className)}>
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-6 shadow-2xl">
        <Icon size={36} className="text-slate-500" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-8 leading-relaxed">{description}</p>
      {action && (
        <Button onClick={action} variant="primary">{actionLabel}</Button>
      )}
    </motion.div>
  )
}

// ── Section Header ──────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action, actionLabel, onAction, center = false, className }) {
  return (
    <div className={clsx(
      'flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8',
      center && 'items-center text-center',
      className
    )}>
      <div className={center ? 'text-center' : ''}>
        <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm font-medium text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {action && (
        <Button variant="secondary" size="sm" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  )
}

// ── Avatar ──────────────────────────────────────────────────
export function Avatar({ name, size = 'md', className, src }) {
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'
  const sizes = { sm: 'w-8 h-8 text-[11px]', md: 'w-10 h-10 text-xs', lg: 'w-14 h-14 text-sm', xl: 'w-20 h-20 text-lg' }
  
  return (
    <div className={clsx(
      'relative group',
      sizes[size],
      className
    )}>
      <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className={clsx(
        'relative h-full w-full rounded-full border-2 border-white/10 overflow-hidden bg-slate-800 flex items-center justify-center font-bold text-white',
        'group-hover:border-indigo-500/50 transition-colors'
      )}>
        {src ? (
          <img src={src} alt={name || 'Avatar'} className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </div>
    </div>
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
    <div className={clsx(
      'shimmer bg-white/5 border border-white/5',
      variants[variant],
      className
    )} />
  )
}

// ── Divider ──────────────────────────────────────────────────
export function Divider({ className }) {
  return (
    <div className={clsx('h-[1px] w-full bg-white/5 my-2', className)} />
  )
}

// ── Tag ──────────────────────────────────────────────────
export function Tag({ children, className, variant = 'default' }) {
  const variants = {
    default: 'bg-white/5 border-white/10 text-slate-400',
    indigo: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    rose: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  }
  return (
    <span className={clsx('px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider', variants[variant], className)}>
      {children}
    </span>
  )
}

// ── FilterChip ─────────────────────────────────────────────
export function FilterChip({ label, active, onClick, className }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={clsx(
        'px-4 py-2 rounded-xl border text-sm font-bold transition-all duration-300',
        active 
          ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/20' 
          : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20 hover:text-white',
        className
      )}
    >
      {label}
    </button>
  )
}
