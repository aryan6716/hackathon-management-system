import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, AlertCircle, Mail, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { apiPost } from '../utils/api'
import { Input, Button } from '../components/ui'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const { login } = useAuth()
  const { showToast } = useToast()

  const from = location.state?.from?.pathname || "/dashboard"

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 400)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.email || !form.password) {
      setError('⚠️ Please fill all fields')
      triggerShake()
      return
    }

    try {
      setLoading(true)

      // ✅ FIXED PAYLOAD
      const res = await apiPost('/auth/login', {
        email: form.email,
        password: form.password
      })

      // ✅ FIXED RESPONSE
      const token = res?.token
      const user = res?.user

      if (!token || !user) {
        throw new Error("Invalid server response")
      }

      login(token, user)

      showToast('🎉 Login successful!', 'success')

      navigate(from, { replace: true })

    } catch (err) {
      const msg = err.message || "Login failed"
      setError(msg)
      showToast(msg, 'error')
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A] text-white relative overflow-hidden px-4">
      {/* Premium Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-violet/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-blue/20 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <motion.div
        className={`w-full max-w-[420px] p-8 sm:p-10 bg-dark-900/60 backdrop-blur-2xl border border-white/10 rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.4)] relative z-10 ${shake ? 'animate-shake' : ''}`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-900 tracking-tight text-white mb-2">
            Welcome back 👋
          </h2>
          <p className="text-sm text-slate-400 font-medium">Log in to your account to continue</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl flex items-center gap-3 drop-shadow-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <AlertCircle size={18} className="shrink-0" />
              <span className="font-medium">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="space-y-5">
          <Input
            type="email"
            placeholder="name@company.com"
            value={form.email}
            onChange={e => update('email', e.target.value)}
            icon={Mail}
            required
          />

          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type={showPwd ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={e => update('password', e.target.value)}
              className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-dark-800/50 border border-white/10 focus:bg-dark-800/80 focus:ring-2 focus:ring-brand-violet/50 focus:border-brand-violet outline-none transition-all duration-300 placeholder:text-slate-500 font-medium text-white shadow-inner"
              required
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex justify-end">
            <a href="#" className="text-xs font-bold text-brand-violet hover:text-white transition-colors">Forgot password?</a>
          </div>

          <Button type="submit" loading={loading} className="w-full py-3.5 !rounded-xl shadow-[0_4px_15px_rgba(124,92,255,0.4)] hover:shadow-[0_4px_25px_rgba(124,92,255,0.6)]">
            {loading ? "Authenticating..." : "Login to Workspace"}
          </Button>
        </form>

        <div className="flex flex-col gap-4 mt-8">
          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-glass-border"></div>
            <span className="flex-shrink-0 mx-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Or continue with</span>
            <div className="flex-grow border-t border-glass-border"></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" className="w-full text-sm font-bold border-white/5 bg-dark-800/30 hover:bg-white/10 py-3 !rounded-xl flex items-center justify-center shadow-inner">
               Google
            </Button>
            <Button variant="secondary" className="w-full text-sm font-bold border-white/5 bg-dark-800/30 hover:bg-white/10 py-3 !rounded-xl flex items-center justify-center shadow-inner">
               Apple
            </Button>
          </div>
        </div>

        <p className="text-center text-sm mt-8 text-slate-400 font-medium">
          Don't have an account?{" "}
          <Link to="/register" className="text-white hover:text-brand-violet font-bold transition-colors underline decoration-white/20 underline-offset-4 pointer-events-auto">
            Create an account
          </Link>
        </p>

      </motion.div>
    </div>
  )
}