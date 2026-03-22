import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Zap, AlertCircle, Mail, Lock, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { apiPost } from '../utils/api'
import { Input, Button } from '../components/ui'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showToast } = useToast()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 400)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    // ✅ validation
    if (!form.name || !form.email || !form.password) {
      setError('⚠️ Please fill all required fields')
      triggerShake()
      return
    }

    try {
      setLoading(true)

      // ✅ CLEAN PAYLOAD (IMPORTANT FIX)
      const data = await apiPost('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password
      })

      // ✅ auto login after register
      login(data.token, data.user)

      showToast('🎉 Registration successful!', 'success')
      navigate('/dashboard')

    } catch (err) {
      const msg = err.message || 'Something went wrong. Try again.'
      setError(msg)
      showToast(msg, 'error')
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#0B0F1A] text-white px-4 py-12 relative overflow-hidden">
      {/* Premium Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-violet/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-blue/20 rounded-full blur-[120px] mix-blend-screen" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-[420px]"
      >
        <div className="bg-dark-900/60 backdrop-blur-2xl p-8 sm:p-10 rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.4)] border border-white/10 relative z-10">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto mb-5 bg-gradient-brand rounded-xl flex items-center justify-center shadow-brand">
              <Zap className="w-6 h-6 text-white" />
            </div>

            <h2 className="text-3xl font-display font-900 tracking-tight text-white mb-2">Create Account</h2>
            <p className="text-sm text-slate-400 font-medium">Join HackathonHub today</p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-6"
              >
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl flex gap-3 items-center drop-shadow-sm">
                  <AlertCircle className="w-[18px] h-[18px] shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <motion.form
            onSubmit={handleRegister}
            animate={shake ? { x: [-6, 6, -6, 6, 0] } : {}}
            className="space-y-5"
          >
            <Input
              label=""
              icon={User}
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Full Name"
              required
            />

            <Input
              label=""
              type="email"
              icon={Mail}
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="name@company.com"
              required
            />

            {/* Password */}
            <div>
              <div className="relative mt-1">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-dark-800/50 border border-white/10 focus:bg-dark-800/80 focus:ring-2 focus:ring-brand-violet/50 focus:border-brand-violet outline-none transition-all duration-300 placeholder:text-slate-500 font-medium text-white shadow-inner"
                  placeholder="Create password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Button */}
            <Button type="submit" loading={loading} className="w-full py-3.5 mt-2 !rounded-xl shadow-[0_4px_15px_rgba(124,92,255,0.4)] hover:shadow-[0_4px_25px_rgba(124,92,255,0.6)]">
              {loading ? 'Creating workspace...' : 'Create Account'}
            </Button>
          </motion.form>

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

          {/* Footer */}
          <p className="text-center text-sm text-slate-400 font-medium mt-8">
            Already have an account?
            <Link to="/login" className="text-white hover:text-brand-violet font-bold transition-colors underline decoration-white/20 underline-offset-4 ml-1.5 pointer-events-auto">
              Login to Workspace
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  )
}