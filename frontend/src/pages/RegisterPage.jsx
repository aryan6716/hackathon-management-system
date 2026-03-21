import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Zap, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { apiPost } from '../utils/api'
import { Input, Button } from '../components/ui'

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showToast } = useToast()

  const [form, setForm] = useState({ name: '', email: '', password: '', githubId: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const handleOAuthLogin = () => {
    showToast('OAuth coming soon 🚀', 'info')
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in required fields.')
      triggerShake()
      return
    }

    try {
      setLoading(true)
      const data = await apiPost('/auth/register', form)
      login(data.token, data.user)
      showToast('Registration successful 🎉', 'success')
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
      showToast(err.message, 'error')
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-dark-950 font-sans text-white relative overflow-hidden py-12 px-6">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
      <motion.div 
        animate={{ scale: [1, 1.15, 1], rotate: [0, -90, 0] }} 
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        className="fixed w-[900px] h-[900px] rounded-full blur-[120px] mix-blend-screen opacity-15 bg-brand-violet -top-60 -right-60 pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }} 
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        className="fixed w-[700px] h-[700px] rounded-full blur-[100px] mix-blend-screen opacity-15 bg-brand-accent bottom-[-200px] left-[-200px] pointer-events-none" 
      />

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
        className="relative z-10 w-full max-w-[440px]"
      >
        <div className="glass-card p-8 sm:p-10 shadow-glass border-white/10 before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:rounded-[15px] before:pointer-events-none">
          
          <div className="flex flex-col items-center mb-8">
            <motion.div 
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-brand mb-6"
            >
              <Zap className="w-7 h-7 text-white" fill="white" />
            </motion.div>
            <h2 className="text-3xl font-display font-800 text-white tracking-tight mb-2 text-center">Join HackathonHub</h2>
            <p className="text-slate-400 font-medium text-sm text-center">Create your developer identity</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="mb-8"
              >
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl flex items-center gap-3 shadow-glass">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Social Auth */}
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleOAuthLogin}
            className="w-full flex items-center justify-center gap-3 p-3.5 rounded-xl bg-dark-800/40 border border-white/5 transition-colors font-medium mb-8 text-sm"
          >
            <GoogleIcon />
            Continue with Google
          </motion.button>

          <div className="relative flex items-center py-2 mb-8">
             <div className="flex-grow border-t border-glass-border"></div>
             <span className="flex-shrink-0 mx-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">Or register with email</span>
             <div className="flex-grow border-t border-glass-border"></div>
          </div>

          <motion.form 
            onSubmit={handleRegister} 
            animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            
            <Input 
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={e => update('name', e.target.value)}
              required
            />

            <Input 
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              value={form.email}
              onChange={e => update('email', e.target.value)}
              required
            />

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  className="w-full bg-dark-800/50 backdrop-blur-sm border border-glass-border rounded-xl px-4 py-3.5 text-sm text-slate-200 placeholder:text-slate-600 outline-none transition-all duration-200 focus:border-brand-violet/50 focus:ring-4 focus:ring-brand-violet/10 focus:bg-dark-700/80 pr-12"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPwd(!showPwd)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-1"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              loading={loading}
              className="w-full py-3.5 text-sm font-bold uppercase tracking-widest mt-6"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </motion.form>

          <p className="text-center text-slate-400 mt-8 text-sm font-medium">
            Already have an account? <Link to="/login" className="text-brand-violet hover:text-brand-accent transition-colors font-bold ml-1">Sign in</Link>
          </p>

        </div>
      </motion.div>
    </div>
  )
}
