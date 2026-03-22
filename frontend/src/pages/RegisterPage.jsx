import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Zap, AlertCircle } from 'lucide-react'
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
    <div className="min-h-[100dvh] flex items-center justify-center bg-dark-950 text-white px-6 py-12">
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 rounded-2xl shadow-xl border border-white/10">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-brand rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>

            <h2 className="text-2xl font-bold">Create Account</h2>
            <p className="text-slate-400 text-sm">Join HackathonHub</p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-4"
              >
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg flex gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <motion.form
            onSubmit={handleRegister}
            animate={shake ? { x: [-6, 6, -6, 6, 0] } : {}}
            className="space-y-4"
          >
            <Input
              label="Full Name"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="John Doe"
              required
            />

            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="name@email.com"
              required
            />

            {/* Password */}
            <div>
              <label className="text-xs text-slate-400">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-lg bg-dark-800 border border-white/10 outline-none"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Button */}
            <Button type="submit" loading={loading} className="w-full mt-4">
              {loading ? 'Creating...' : 'Create Account'}
            </Button>
          </motion.form>

          {/* Footer */}
          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?
            <Link to="/login" className="text-violet-400 ml-1">
              Login
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  )
}