import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { apiPost } from '../utils/api'
import clsx from 'clsx'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showToast } = useToast()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [formErrors, setFormErrors] = useState({ name: '', email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    if (formErrors[key]) setFormErrors(p => ({ ...p, [key]: '' }))
  }

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setFormErrors({ name: '', email: '', password: '' })

    let hasErr = false
    const errs = { name: '', email: '', password: '' }

    if (!form.name) { errs.name = 'Name is required'; hasErr = true }
    if (!form.email) { errs.email = 'Email is required'; hasErr = true }
    if (!form.password) { errs.password = 'Password is required'; hasErr = true }

    if (hasErr) {
      setFormErrors(errs)
      triggerShake()
      return
    }

    try {
      setLoading(true)
      const data = await apiPost('/auth/register', form)
      login(data.token, data.user)
      showToast('Account created successfully!', 'success')
      navigate('/dashboard')
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error')
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 w-screen h-screen flex overflow-hidden">

      {/* LEFT PANEL */}
      <div className="hidden md:flex w-1/2 h-full flex-col justify-center px-16 lg:px-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 relative">

        {/* Glow overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_40%)]" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-8 h-8 text-white" />
            <span className="text-white font-extrabold tracking-widest text-xl uppercase">
              HackathonHub
            </span>
          </div>

          <h2 className="text-5xl font-extrabold text-white mb-6 leading-tight">
            Design. Build.<br />
            <span className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              Scale Faster.
            </span>
          </h2>

          <p className="text-white/80 text-lg max-w-md">
            Join the ultimate hub for building exceptional projects. Get access to premium tools and scale your ideas.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-1/2 h-full bg-[#0f172a] flex items-center justify-center px-8 md:px-16">

        <motion.div
          animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >

          <h1 className="text-4xl font-extrabold text-white mb-2">
            Create account
          </h1>

          <p className="text-slate-400 mb-8">
            Join us and start building today.
          </p>

          <form onSubmit={handleRegister} className="space-y-5">

            {/* NAME */}
            <div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                />
              </div>
              {formErrors.name && <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>}
            </div>

            {/* EMAIL */}
            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                />
              </div>
              {formErrors.email && <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>}
            </div>

            {/* PASSWORD */}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPwd ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {formErrors.password && <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-bold flex items-center justify-center gap-2"
            >
              {loading ? "Loading..." : <>Get started <ArrowRight size={18} /></>}
            </button>

          </form>

          <p className="mt-6 text-center text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 font-semibold">
              Sign in
            </Link>
          </p>

        </motion.div>
      </div>
    </div>
  )
}