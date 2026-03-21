import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Zap, Users, Upload, Trophy, User,
  LogOut, ChevronLeft, ChevronRight
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import clsx from 'clsx'

const NAV_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/hackathons', icon: Zap, label: 'Hackathons' },
  { path: '/teams', icon: Users, label: 'Teams' },
  { path: '/submissions', icon: Upload, label: 'Submissions' },
  { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { path: '/profile', icon: User, label: 'Profile' },
]

function AvatarCircle({ name = "User", size = 'md' }) {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : "U"

  const sizeClass = size === 'sm' ? 'w-8 h-8 text-[11px]' : 'w-10 h-10 text-xs'

  return (
    <div className={clsx(
      'rounded-full bg-gradient-card border border-glass-border shadow-glass flex items-center justify-center font-display font-800 text-white flex-shrink-0',
      sizeClass
    )}>
      {initials}
    </div>
  )
}

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside 
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={clsx(
          'fixed top-0 left-0 h-full z-50 flex flex-col',
          'bg-dark-900/50 backdrop-blur-xl border-r border-glass-border',
          sidebarCollapsed ? 'w-20' : 'w-64',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'transition-transform duration-300 lg:transition-none'
        )}
      >
        <div className={clsx(
          'flex items-center h-20 px-5 border-b border-white/5',
          sidebarCollapsed ? 'justify-center' : 'justify-between'
        )}>
          {!sidebarCollapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="flex items-center gap-3 overflow-hidden"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center shadow-brand shrink-0">
                <Zap className="w-4 h-4 text-white" fill="white" />
              </div>
              <span className="text-white text-xl font-display font-800 tracking-tight whitespace-nowrap">
                HackathonHub
              </span>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className="hidden lg:flex p-2 rounded-xl text-slate-500 hover:text-white hover:bg-dark-800/80 transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </motion.button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto no-scrollbar">
          {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMobileSidebarOpen(false)}
              className={({ isActive }) => clsx(
                'relative flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 group',
                isActive
                  ? 'text-white bg-white/5 shadow-glass'
                  : 'text-slate-500 hover:text-white hover:bg-white/[0.02]'
              )}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-pill"
                      className="absolute inset-0 bg-gradient-to-r from-brand-violet/20 to-brand-blue/10 border border-brand-violet/30 rounded-xl shadow-[0_0_20px_rgba(124,92,255,0.15)] z-0"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon className={clsx("w-5 h-5 relative z-10 transition-colors", isActive ? "text-brand-violet" : "group-hover:text-slate-300")} />
                  {!sidebarCollapsed && (
                    <span className="relative z-10 whitespace-nowrap">{label}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-glass-border">
          <div className={clsx("flex items-center mb-3", sidebarCollapsed ? "justify-center" : "gap-3")}>
            <AvatarCircle name={user?.name || "U"} size={sidebarCollapsed ? "sm" : "md"} />
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-white text-sm font-bold truncate">
                  {loading ? "Loading..." : (user?.name || "User")}
                </p>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  {user?.role || "Participant"}
                </p>
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className={clsx(
              "flex items-center text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all",
              sidebarCollapsed ? "justify-center p-3" : "w-full gap-2 px-4 py-3"
            )}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span className="whitespace-nowrap">Logout</span>}
          </motion.button>
        </div>
      </motion.aside>
    </>
  )
}