import React, { createContext, useContext, useCallback } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { CheckCircle, AlertCircle, Info } from 'lucide-react'

const ToastContext = createContext(null)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

export const ToastProvider = ({ children }) => {
  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const options = {
      duration,
      style: {
        background: 'rgba(3, 7, 18, 0.9)',
        color: '#f9fafb',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      },
      success: {
        icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
        style: {
          border: '1px solid rgba(16, 185, 129, 0.2)',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.1)',
        }
      },
      error: {
        icon: <AlertCircle className="w-5 h-5 text-red-400" />,
        style: {
          border: '1px solid rgba(239, 68, 68, 0.2)',
          boxShadow: '0 0 20px rgba(239, 68, 68, 0.1)',
        }
      },
    }

    if (type === 'success') toast.success(message, options)
    else if (type === 'error') toast.error(message, options)
    else toast(message, {
      ...options,
      icon: <Info className="w-5 h-5 text-indigo-400" />,
    })
  }, [])

  const dismissToast = useCallback((id) => {
    toast.dismiss(id)
  }, [])

  React.useEffect(() => {
    const handleToastError = (e) => {
      // Avoid spamming the same error
      showToast(e.detail, 'error')
    }
    window.addEventListener('toast_error', handleToastError)
    window.addEventListener('toast_success', (e) => showToast(e.detail, 'success'))

    return () => {
      window.removeEventListener('toast_error', handleToastError)
      window.removeEventListener('toast_success', (e) => showToast(e.detail, 'success'))
    }
  }, [showToast])

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'premium-toast',
        }}
      />
    </ToastContext.Provider>
  )
}
