import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Zap, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { apiPost } from '../utils/api'
import { Input, Button } from '../components/ui'

// icons same as your code...

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const { login } = useAuth()
  const { showToast } = useToast()

  // ✅ FIX 1: SMART REDIRECT
  const from = location.state?.from?.pathname || "/dashboard"

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.email || !form.password) {
      setError('Please fill all fields.')
      triggerShake()
      return
    }

    try {
      setLoading(true)

      const data = await apiPost('/auth/login', form)

      login(data.token, data.user)

      showToast('Login successful 🎉', 'success')

      // ✅ FIX 2: REDIRECT PROPERLY
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
    <div className="min-h-screen flex items-center justify-center bg-dark-950 font-sans text-white">

      <motion.div className="w-full max-w-md p-8 bg-dark-900 rounded-xl shadow-lg">

        <h2 className="text-2xl font-bold text-center mb-6">Welcome back</h2>

        <AnimatePresence>
          {error && (
            <motion.div className="mb-4 text-red-400 text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="space-y-4">

          <Input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => update('email', e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPwd ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={e => update('password', e.target.value)}
              className="w-full p-3 rounded bg-dark-800 border border-gray-700"
              required
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-3"
            >
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button type="submit" loading={loading} className="w-full">
            {loading ? "Logging in..." : "Login"}
          </Button>

        </form>

        <p className="text-center text-sm mt-4">
          Don't have an account? <Link to="/register">Register</Link>
        </p>

      </motion.div>
    </div>
  )
}