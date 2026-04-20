import React, { useId } from 'react'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'

// ── Button ──────────────────────────────────────────────────
export function Button({ variant = 'primary', size = 'md', children, className, loading, icon: Icon, type = 'button', disabled, ...props }) {
  const base = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200'
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700',
    ghost: 'text-gray-400 hover:text-white hover:bg-gray-800',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2',
  }
  
  return (
    <button
      type={type}
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
          {Icon && <Icon className="w-4 h-4 mr-2" />}
          {children}
        </>
      )}
    </button>
  )
}

// ── Card ──────────────────────────────────────────────────
export function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={clsx(
        'bg-gray-900 border border-gray-800 rounded-lg p-6',
        hover && 'transition-colors duration-200 hover:border-gray-600',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ── StatCard ──────────────────────────────────────────────
export function StatCard({ label, value, icon: Icon, delta, color = 'indigo', className }) {
  const colors = {
    indigo: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  }
  
  return (
    <Card hover className={clsx('relative', className)}>
      <div className="absolute top-0 right-0 p-3 opacity-5">
        <Icon size={64} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={clsx('w-10 h-10 rounded-md flex items-center justify-center border', colors[color])}>
            <Icon size={18} />
          </div>
          {delta !== undefined && (
            <div className={clsx(
              'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md border',
              (typeof delta === 'number' ? delta : parseFloat(delta)) >= 0 
                ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' 
                : 'text-red-500 bg-red-500/10 border-red-500/20'
            )}>
              {(typeof delta === 'number' ? delta : parseFloat(delta)) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(delta) || 0).toFixed(1)}%
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold text-white">{value}</h3>
          <p className="text-sm text-gray-400 capitalize">{label}</p>
        </div>
      </div>
    </Card>
  )
}

// ── Badge ──────────────────────────────────────────────────
export function Badge({ variant = 'default', children, className }) {
  const variants = {
    active: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    upcoming: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
    completed: 'bg-gray-100 text-gray-800 border border-gray-200',
    featured: 'bg-amber-100 text-amber-800 border border-amber-200',
    review: 'bg-purple-100 text-purple-800 border border-purple-200',
    draft: 'bg-gray-200 text-gray-600 border border-gray-300',
    scored: 'bg-blue-100 text-blue-800 border border-blue-200',
    default: 'bg-gray-100 text-gray-700 border border-gray-200',
  }
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium', variants[variant], className)}>
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
    <div className="space-y-1">
      {label && <label htmlFor={inputId} className="block text-sm font-medium text-gray-300">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={16} />
          </div>
        )}
        <input
          id={inputId}
          className={clsx(
            'block w-full rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-500',
            'focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors px-3 py-2 text-sm',
            Icon && 'pl-9',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={errorId}
          {...props}
        />
      </div>
      {error && (
        <p id={errorId} className="text-xs text-red-400 mt-1">
          {error}
        </p>
      )}
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
    indigo: 'bg-indigo-600',
    purple: 'bg-purple-600',
    blue: 'bg-blue-600',
    emerald: 'bg-emerald-600',
  }
  return (
    <div className={clsx('h-2 bg-gray-800 rounded-full overflow-hidden', className)}>
      <div
        style={{ width: `${pct}%` }}
        className={clsx('h-full transition-all duration-300', colors[color])}
      />
    </div>
  )
}

// ── Empty State ──────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="h-12 w-12 text-gray-500 mb-4">
        {Icon && <Icon className="w-full h-full" />}
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-400 max-w-sm mb-6">{description}</p>
      {action && (
        <Button onClick={action} variant="primary">{actionLabel}</Button>
      )}
    </div>
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
    <div className={clsx('relative', sizes[size], className)}>
      <div className="h-full w-full rounded-full border border-gray-700 overflow-hidden bg-gray-800 flex items-center justify-center font-medium text-gray-300">
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
    default: 'bg-gray-800 text-gray-300',
    indigo: 'bg-indigo-900/50 text-indigo-300',
    emerald: 'bg-emerald-900/50 text-emerald-300',
    rose: 'bg-red-900/50 text-red-300',
    amber: 'bg-amber-900/50 text-amber-300',
  }
  return (
    <span className={clsx('px-2 py-1 rounded-md text-xs font-medium', variants[variant], className)}>
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
        'px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 border',
        active 
          ? 'bg-indigo-600 text-white border-indigo-600' 
          : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700 hover:text-white',
        className
      )}
    >
      {label}
    </button>
  )
}
