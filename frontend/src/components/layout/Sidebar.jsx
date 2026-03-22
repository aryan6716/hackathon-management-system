import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Zap, Users, Upload, Trophy, User,
  LogOut, ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import clsx from 'clsx'
import { Avatar } from '../ui'

const NAV_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/hackathons', icon: Zap, label: 'Hackathons' },
  { path: '/teams', icon: Users, label: 'Teams' },
  { path: '/submissions', icon: Upload, label: 'Submissions' },
  { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { path: '/profile', icon: User, label: 'Profile' },
]

export default function Sidebar() {
  const {
    sidebarCollapsed,
    toggleSidebar,
    mobileSidebarOpen,
    setMobileSidebarOpen,
  } = useApp()

  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside 
        initial={false}
        animate={{ 
          width: sidebarCollapsed ? 80 : 288,
          x: mobileSidebarOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -288 : 0)
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={clsx(
          'fixed top-0 left-0 h-full z-50 flex flex-col',
          'bg-slate-950/40 backdrop-blur-2xl border-r border-white/5 shadow-2xl transition-all duration-300'
        )}
      >
        {/* Header/Logo */}
        <div className={clsx(
          'flex items-center h-20 px-6 border-b border-white/5',
          sidebarCollapsed ? 'justify-center' : 'justify-between'
        )}>
          {!sidebarCollapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="flex items-center gap-3 overflow-hidden"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-white text-xl font-bold tracking-tight whitespace-nowrap bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                HackerPulse
              </span>
            </motion.div>
          )}

          {sidebarCollapsed && (
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          )}

          <button
            onClick={toggleSidebar}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all absolute -right-3 top-24 bg-slate-900 border border-white/10 shadow-xl"
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto no-scrollbar">
          {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMobileSidebarOpen(false)}
              className={({ isActive }) => clsx(
                'relative flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group overflow-hidden',
                isActive ? 'text-white' : 'text-slate-500 hover:text-slate-200'
              )}
            >
              {({ isActive }) => (
                <>
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="active-pill"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-indigo-600/10 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)] z-0 rounded-xl"
                      />
                    )}
                  </AnimatePresence>
                  
                  <Icon className={clsx(
                    "w-5 h-5 relative z-10 transition-all duration-300",
                    isActive ? "text-indigo-400 scale-110" : "group-hover:scale-110"
                  )} />
                  
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="relative z-10 whitespace-nowrap"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile / Logout */}
        <div className="p-4 border-t border-white/5 bg-white/[0.01]">
          <div className={clsx("flex items-center mb-4 transition-all duration-300", sidebarCollapsed ? "justify-center" : "gap-3 px-2")}>
            <Avatar name={user?.name || "U"} size={sidebarCollapsed ? "sm" : "md"} />
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-white text-sm font-bold truncate">
                  {loading ? "..." : (user?.name || "User")}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                    Online
                  </p>
                </div>
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02, x: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className={clsx(
              "flex items-center gap-3 text-sm font-bold text-slate-500 hover:text-red-400 rounded-xl transition-all",
              sidebarCollapsed ? "justify-center p-3" : "w-full px-4 py-3 hover:bg-red-500/5"
            )}
          >
            <LogOut size={18} className="shrink-0" />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </motion.button>
        </div>
      </motion.aside>
    </>
  )
}