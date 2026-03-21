import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import clsx from 'clsx'

const ToastContext = createContext(null)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])
  let idCounter = useRef(0)

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++idCounter.current
    setToasts(prev => [...prev, { id, message, type }])

    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id)
      }, duration)
    }
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-400" />
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />
      default: return <Info className="w-5 h-5 text-brand-violet" />
    }
  }

  const getStyles = (type) => {
    switch (type) {
      case 'success': return 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_4px_20px_rgba(16,185,129,0.1)]'
      case 'error': return 'bg-red-500/10 border-red-500/20 shadow-[0_4px_20px_rgba(239,68,68,0.15)]'
      default: return 'bg-brand-violet/15 border-brand-violet/30 shadow-[0_4px_20px_rgba(124,92,255,0.15)]'
    }
  }

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={clsx(
                "pointer-events-auto flex items-stretch min-w-[300px] rounded-xl border backdrop-blur-xl overflow-hidden shadow-glass",
                getStyles(t.type)
              )}
            >
              <div className="p-3.5 flex items-center justify-center bg-dark-900/40 border-r border-glass-border">
                {getIcon(t.type)}
              </div>
              <div className="p-3.5 flex-1 flex flex-col justify-center">
                <p className="text-sm font-bold text-white tracking-wide leading-tight">{t.message}</p>
              </div>
              <button 
                onClick={() => dismissToast(t.id)}
                className="p-3.5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
