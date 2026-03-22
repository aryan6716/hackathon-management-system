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
  const [formErrors, setFormErrors] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 400)
  }

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setFormErrors({ email: '', password: '' })

    let hasErr = false
    const errs = { email: '', password: '' }
    if (!form.email) { errs.email = 'Email is required'; hasErr = true }
    if (!form.password) { errs.password = 'Password is required'; hasErr = true }

    if (hasErr) {
      setFormErrors(errs)
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
      showToast(msg, 'error')
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }
  const itemVars = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  }

  return (
    <div onMouseMove={handleMouseMove} className="min-h-[100dvh] flex items-center justify-center bg-[#0B0F1A] text-white relative overflow-hidden px-4 md:px-0">
      {/* Wow Effect: Cursor Glow */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300 hidden sm:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(124,92,255,0.06), transparent 40%)`
        }}
      />
      {/* Premium Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[#0B0F1A] bg-[linear-gradient(45deg,#0B0F1A,#1a0b2e,#0a192f)] bg-[length:400%_400%] animate-gradient">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-violet/20 rounded-full blur-[120px] mix-blend-screen animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-blue/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-200" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-brand-accent/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-400" />
      </div>

      <motion.div
        className={`w-full max-w-[420px] p-8 sm:p-10 bg-white/10 backdrop-blur-xl border border-white/20 ring-1 ring-white/10 rounded-[24px] shadow-[0_24px_48px_rgba(0,0,0,0.5)] hover:scale-[1.02] hover:shadow-[0_32px_64px_rgba(0,0,0,0.6)] transition-all duration-500 relative z-10 ${shake ? 'animate-shake' : ''}`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-display font-900 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 mb-3">
            Welcome back 👋
          </h2>
          <p className="text-base text-slate-300 font-medium tracking-wide">Log in to your account to continue</p>
        </div>

        <motion.form 
          onSubmit={handleLogin} 
          className="space-y-5"
          variants={containerVars}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVars}>
            <Input
              type="email"
              placeholder="name@company.com"
              value={form.email}
              onChange={e => update('email', e.target.value)}
              icon={Mail}
              error={formErrors.email}
            />
          </motion.div>

          <motion.div variants={itemVars} className="space-y-1.5">
            <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 pointer-events-none" />
            <input
              type={showPwd ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={e => update('password', e.target.value)}
              className={`w-full pl-11 pr-11 py-3.5 rounded-xl bg-white/5 backdrop-blur-xl border ${formErrors.password ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30 animate-shake' : 'border-white/10 focus:border-indigo-500 focus:ring-indigo-500/50'} focus:bg-white/10 focus:scale-[1.01] focus:ring-2 outline-none transition-all duration-300 placeholder:text-slate-400 font-medium text-white shadow-inner`}
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
            >
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {formErrors.password && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-medium text-red-400 mt-1.5 ml-1">
              {formErrors.password}
            </motion.p>
          )}
          </motion.div>

          <motion.div variants={itemVars} className="flex justify-end">
            <a href="#" className="text-xs font-bold text-brand-violet hover:text-white transition-colors">Forgot password?</a>
          </motion.div>

          <motion.div variants={itemVars}>
            <Button type="submit" loading={loading} className="w-full py-3.5 !rounded-xl active:scale-[0.98]">
              {loading ? "Authenticating..." : "Login to Workspace"}
            </Button>
          </motion.div>
        </motion.form>

        <div className="flex flex-col gap-4 mt-8">
          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-glass-border"></div>
            <span className="flex-shrink-0 mx-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Or continue with</span>
            <div className="flex-grow border-t border-glass-border"></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" className="w-full text-sm font-bold border-white/10 bg-white/5 hover:bg-white/10 py-3 !rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_16px_transparent] hover:shadow-[0_4px_16px_rgba(255,255,255,0.05)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
               <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
               Google
            </Button>
            <Button variant="secondary" className="w-full text-sm font-bold border-white/10 bg-white/5 hover:bg-white/10 py-3 !rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_16px_transparent] hover:shadow-[0_4px_16px_rgba(255,255,255,0.05)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
               <svg className="w-4 h-4 flex-shrink-0 text-white fill-current" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.5-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.05 2.26.45 3.02.45.72 0 1.95-.5 3.48-.4 2.15.1 3.56 1 4.5 2.5-4.46 2.45-3.65 8.1 1.05 9.9-1.07 2.09-2.3 4.2-4.05 4.52z"/><path d="M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.37-2.01 4.41-3.74 4.25z"/></svg>
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