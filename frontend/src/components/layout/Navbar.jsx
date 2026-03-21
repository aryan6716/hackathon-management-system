import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, Search, Bell
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import UserProfileDropdown from './UserProfileDropdown'
import clsx from 'clsx'
import { Badge } from '../ui'

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview & Metrics' },
  '/hackathons': { title: 'Hackathons', subtitle: 'Explore & Participate' },
  '/teams': { title: 'Squads', subtitle: 'Collaborate with hackers' },
  '/submissions': { title: 'Submissions', subtitle: 'Manage your portfolio' },
  '/leaderboard': { title: 'Leaderboard', subtitle: 'Global Hall of Fame' },
  '/profile': { title: 'Profile', subtitle: 'Account Identity' },
}

const mockNotifications = [
  { id: 1, text: 'Judge assigned a score: 9.5!', time: '2m ago', unread: true },
  { id: 2, text: 'New featured event: YC Hacks', time: '1h ago', unread: true },
  { id: 3, text: 'Someone requested to join Team Neural', time: '1d ago', unread: false },
]

export default function Navbar() {
  const { toggleMobileSidebar, sidebarCollapsed } = useApp()
  const { pathname } = useLocation()
  const pageInfo = PAGE_TITLES[pathname] || { title: 'Overview', subtitle: '' }

  const [showNotif, setShowNotif] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  
  const unreadCount = mockNotifications.filter(n => n.unread).length

  return (
    <motion.header 
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={clsx(
        'fixed top-0 right-0 h-20 z-30 flex items-center',
        'bg-dark-900/50 backdrop-blur-xl border-b border-glass-border shadow-glass',
        sidebarCollapsed ? 'left-20' : 'left-0 lg:left-64'
      )}
    >
      <div className="flex-1 flex items-center justify-between px-6 lg:px-8 gap-6 h-full">

        {/* LEFT BRANDING */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleMobileSidebar}
            className="lg:hidden p-2.5 rounded-xl text-slate-500 bg-white/5 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:block">
            <motion.h1 
              key={pageInfo.title}
              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
              className="font-display font-800 text-white text-xl tracking-tight leading-none"
            >
              {pageInfo.title}
            </motion.h1>
            <motion.p 
              key={pageInfo.subtitle}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold"
            >
              {pageInfo.subtitle}
            </motion.p>
          </div>
        </div>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-3">
          
          {/* SEARCH */}
          <motion.div 
            layout
            className={clsx(
              'hidden md:flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-colors duration-300',
              searchFocused
                ? 'bg-dark-800/80 border-brand-violet/50 shadow-[0_0_30px_rgba(124,92,255,0.15)] ring-2 ring-brand-violet/20 w-80'
                : 'bg-dark-800/40 border-glass-border w-56 hover:bg-dark-800/60 hover:border-white/10'
            )}
          >
            <Search className={clsx("w-4 h-4 transition-colors", searchFocused ? "text-brand-violet" : "text-slate-500")} />
            <input
              type="text"
              placeholder="Search components..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="bg-transparent text-sm font-medium text-slate-200 placeholder:text-slate-500 outline-none w-full"
            />
            {searchFocused && (
              <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/10 uppercase">
                ESC
              </span>
            )}
          </motion.div>

          {/* NOTIFICATIONS */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotif(p => !p)}
              className={clsx(
                "relative p-3 rounded-xl border transition-all duration-300",
                showNotif 
                  ? "bg-dark-700/80 border-brand-violet/30 text-white shadow-[0_0_20px_rgba(124,92,255,0.2)]" 
                  : "bg-dark-800/40 border-glass-border text-slate-500 hover:text-white"
              )}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-3 w-2 h-2 bg-brand-violet rounded-full shadow-[0_0_10px_rgba(124,92,255,0.8)] border-2 border-dark-900" />
              )}
            </motion.button>

            <AnimatePresence>
              {showNotif && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="absolute right-0 top-[120%] mt-2 w-80 bg-dark-900/90 backdrop-blur-xl border border-glass-border rounded-2xl shadow-glass overflow-hidden z-50 origin-top-right"
                >
                  <div className="px-5 py-4 border-b border-glass-border flex justify-between items-center bg-white/[0.02]">
                    <span className="text-sm font-display font-800 text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <Badge variant="active" className="text-[10px] py-0">{unreadCount} new</Badge>
                    )}
                  </div>
                  <div className="max-h-[320px] overflow-y-auto no-scrollbar">
                      {mockNotifications.map(n => (
                      <div key={n.id} className="px-5 py-4 hover:bg-white/5 border-b border-glass-border last:border-0 cursor-pointer group transition-colors">
                          <p className={clsx("text-sm transition-colors leading-snug", n.unread ? "text-white font-bold" : "text-slate-400 font-medium group-hover:text-slate-200")}>
                              {n.text}
                          </p>
                          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-600 mt-2">{n.time}</p>
                      </div>
                      ))}
                  </div>
                  <div className="p-2 border-t border-glass-border bg-white/[0.02]">
                    <button className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                        Mark all as read
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-8 w-[1px] bg-glass-border mx-1" />
          
          <UserProfileDropdown />
          
        </div>
      </div>
    </motion.header>
  )
}