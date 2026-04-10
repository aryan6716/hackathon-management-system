import React, { useState, useRef, useEffect } from 'react'
import { User, LogOut, LayoutDashboard, ChevronDown, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Avatar, Divider } from '../ui'
import clsx from 'clsx'

export default function UserProfileDropdown() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef(null)
  const triggerRef = useRef(null)
  const dropdownRef = useRef(null)

  // Dynamically compute horizontal arrow offset (aligns with avatar center)
  const computeArrowRight = () => {
    if (!triggerRef.current || !dropdownRef.current) return 20
    const triggerRect = triggerRef.current.getBoundingClientRect()
    const dropdownRect = dropdownRef.current.getBoundingClientRect()
    // Center of the avatar is roughly 20px from the left of trigger
    const avatarCenterX = triggerRect.left + 20
    const arrowRight = dropdownRect.right - avatarCenterX
    return Math.max(12, Math.min(arrowRight, dropdownRect.width - 12))
  }
  const [arrowRight, setArrowRight] = useState(20)

  // Recalculate arrow on open
  useEffect(() => {
    if (isOpen) {
      // Use requestAnimationFrame to wait for dropdown to be in DOM
      requestAnimationFrame(() => {
        setArrowRight(computeArrowRight())
      })
    }
  }, [isOpen])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close on Esc
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setIsOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    {
      label: 'Profile Details',
      icon: User,
      description: 'View and edit your profile',
      onClick: () => { setIsOpen(false); navigate('/profile') }
    },
    {
      label: 'My Dashboard',
      icon: LayoutDashboard,
      description: 'Access your analytics',
      onClick: () => { setIsOpen(false); navigate('/dashboard') }
    },
  ]

  if (loading) {
    return <div className="w-9 h-9 rounded-xl bg-dark-700 animate-pulse" />
  }

  return (
    <div ref={wrapperRef} className="relative inline-block">

      {/* ── TRIGGER ── */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(o => !o)}
        aria-label="Open profile menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={clsx(
          'flex items-center gap-2.5 p-1 rounded-xl transition-all duration-200 cursor-pointer',
          isOpen
            ? 'bg-white/10 ring-1 ring-white/10'
            : 'hover:bg-white/5'
        )}
      >
        {/* Avatar with online dot */}
        <div className="relative flex-shrink-0">
              <Avatar
                name={user?.name}
                size="md"
            className={clsx(
              'shadow-md transition-all duration-200',
              isOpen ? 'ring-2 ring-brand-violet/50' : 'group-hover:ring-2 group-hover:ring-brand-violet/30'
            )}
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#10111a] shadow" />
        </div>

        {/* Name + role */}
        <div className="hidden sm:flex flex-col items-start leading-tight">
          <span className="text-[13px] font-bold text-white tracking-tight">
            {user?.name?.split(' ')[0] || 'User'}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest">
            {user?.role || 'PARTICIPANT'}
          </span>
        </div>

        <ChevronDown className={clsx(
          'hidden sm:block w-3.5 h-3.5 text-slate-500 transition-transform duration-200',
          isOpen && 'rotate-180 text-white'
        )} />
      </button>

      {/* ── DROPDOWN ── */}
      {isOpen && (
        <div
          ref={dropdownRef}
          role="menu"
          className={clsx(
            // Positioning: anchored to right edge of parent, gap from trigger
            'absolute right-0 top-full mt-2 z-[100]',
            // Width — constrained to never overflow viewport
            'w-72 max-w-[calc(100vw-1.5rem)]',
            // Visual: dark glass card
            'rounded-2xl border border-white/[0.08] overflow-hidden',
            'bg-[#0e0f17]/95 backdrop-blur-2xl',
            'shadow-[0_24px_56px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04),0_8px_24px_rgba(139,92,246,0.12)]',
            // Entry animation
            'animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 origin-top-right'
          )}
          style={{ transformOrigin: 'top right' }}
        >
          {/* Arrow / caret pointing up to the avatar */}
          <div
            className="absolute -top-[5px] w-[10px] h-[10px] bg-[#0e0f17] border-l border-t border-white/[0.08] rotate-45"
            style={{ right: `${arrowRight}px` }}
          />

          {/* ── HEADER ── */}
          <div className="flex items-center gap-3.5 px-4 py-4">
            <div className="relative flex-shrink-0">
              <Avatar
                name={user?.name}
                size="lg"
                className="w-11 h-11 ring-2 ring-white/10 shadow-xl"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0e0f17]" />
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-bold text-white truncate leading-none tracking-tight">
                {user?.name || 'Guest User'}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5 opacity-55">
                <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className="text-[11px] text-slate-400 truncate">
                  {user?.email}
                </span>
              </div>
            </div>
          </div>

          <Divider className="opacity-40" />

          {/* ── MENU ITEMS ── */}
          <div className="p-2 space-y-0.5">
            {menuItems.map((item, i) => (
              <button
                key={i}
                onClick={item.onClick}
                role="menuitem"
                className={clsx(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer',
                  'text-slate-400 text-sm',
                  'transition-all duration-150 hover:bg-white/[0.08] hover:text-white',
                  'active:scale-[0.98]',
                  'group'
                )}
              >
                <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-brand-violet/15 group-hover:text-brand-violet text-slate-500">
                  <item.icon className="w-[15px] h-[15px]" />
                </div>
                <div className="flex flex-col items-start leading-snug text-left">
                  <span className="font-semibold text-[13px]">{item.label}</span>
                  <span className="text-[11px] text-slate-600 group-hover:text-slate-500 transition-colors">
                    {item.description}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <Divider className="opacity-40" />

          {/* ── SIGN OUT ── */}
          <div className="p-2">
            <button
              onClick={handleLogout}
              aria-label="Sign out"
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer',
                'text-red-400/70 text-sm',
                'transition-all duration-150 hover:bg-red-500/[0.08] hover:text-red-400',
                'active:scale-[0.98]',
                'group'
              )}
            >
              <div className="w-8 h-8 rounded-lg bg-red-500/[0.06] flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-red-500/[0.12] group-hover:text-red-400 text-red-400/60">
                <LogOut className="w-[15px] h-[15px] group-hover:translate-x-0.5 transition-transform" />
              </div>
              <span className="font-semibold text-[13px]">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
