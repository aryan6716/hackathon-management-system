import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, Search, Bell, X, Command
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import UserProfileDropdown from './UserProfileDropdown'
import clsx from 'clsx'
import { Badge, Button } from '../ui'

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
  const { user } = useAuth()
  const { pathname } = useLocation()
  
  const pageInfo = PAGE_TITLES[pathname] || { title: 'Overview', subtitle: '' }

  const [showNotif, setShowNotif] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  const unreadCount = mockNotifications.filter(n => n.unread).length

  const hour = new Date().getHours()
  const timeGreeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'
  const firstName = user?.name ? user.name.split(' ')[0] : 'Hacker'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header 
      initial={false}
      animate={{ 
        height: scrolled ? 64 : 80,
        backgroundColor: scrolled ? 'rgba(3, 7, 18, 0.8)' : 'rgba(3, 7, 18, 0.4)'
      }}
      className={clsx(
        'fixed top-0 right-0 z-30 flex items-center transition-all duration-300 backdrop-blur-xl border-b border-white/[0.05]',
        sidebarCollapsed ? 'left-20' : 'left-0 lg:left-72'
      )}
    >
      <div className="flex-1 flex items-center justify-between px-6 lg:px-10 h-full">

        {/* LEFT: Branding/Title */}
        <div className="flex items-center gap-6">
          <button
            onClick={toggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-400 bg-white/5 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  {pathname === '/dashboard' ? (
                    <>
                      <span>{timeGreeting},</span>
                      <span className="text-gradient">{firstName}</span>
                      <span className="animate-bounce">🚀</span>
                    </>
                  ) : pageInfo.title}
                </h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-0.5">
                  {pageInfo.subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT: Controls */}
        <div className="flex items-center gap-4">
          
          {/* SEARCH BAR */}
          <div className="relative group hidden md:block">
            <div className={clsx(
              "absolute inset-0 bg-indigo-500/20 rounded-xl blur-xl transition-opacity duration-300",
              searchFocused ? "opacity-100" : "opacity-0 invisible"
            )} />
            <div className={clsx(
              "relative flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-300",
              searchFocused 
                ? "w-80 bg-slate-900 border-indigo-500/50 shadow-2xl" 
                : "w-64 bg-white/[0.03] border-white/10 hover:border-white/20"
            )}>
              <Search className={clsx("w-4 h-4 transition-colors", searchFocused ? "text-indigo-400" : "text-slate-500")} />
              <input
                type="text"
                placeholder="Quick search..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="bg-transparent text-sm font-medium text-slate-200 placeholder:text-slate-500 outline-none w-full"
              />
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-slate-500">
                <Command size={10} />
                <span>K</span>
              </div>
            </div>
          </div>

          {/* NOTIFICATIONS */}
          <div className="relative">
            <button
              onClick={() => setShowNotif(!showNotif)}
              className={clsx(
                "relative p-2.5 rounded-xl border transition-all duration-300 group",
                showNotif 
                  ? "bg-slate-900 border-indigo-500/50 text-white shadow-lg" 
                  : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white"
              )}
            >
              <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full ring-4 ring-slate-950" />
              )}
            </button>

            <AnimatePresence>
              {showNotif && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-3 w-80 glass-panel rounded-2xl overflow-hidden z-50 shadow-2xl origin-top-right"
                >
                  <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <span className="text-sm font-bold text-white">Notifications</span>
                    <Badge variant="active">{unreadCount} New</Badge>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto">
                    {mockNotifications.map(n => (
                      <div key={n.id} className="p-4 border-b border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer group">
                        <p className={clsx("text-sm leading-snug transition-colors", n.unread ? "text-white font-semibold" : "text-slate-400")}>
                          {n.text}
                        </p>
                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mt-2 group-hover:text-slate-500 transition-colors">
                          {n.time}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-white/[0.01]">
                    <Button variant="ghost" size="sm" className="w-full text-xs">Clear All Notifications</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-[1px] h-6 bg-white/10 mx-1 hidden sm:block" />

          {/* PROFILE */}
          <UserProfileDropdown />
          
        </div>
      </div>
    </motion.header>
  )
}