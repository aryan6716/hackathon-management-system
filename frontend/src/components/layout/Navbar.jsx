import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import UserProfileDropdown from './UserProfileDropdown'
import clsx from 'clsx'

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview & Metrics' },
  '/hackathons': { title: 'Hackathons', subtitle: 'Explore & Participate' },
  '/teams': { title: 'Squads', subtitle: 'Collaborate with hackers' },
  '/submissions': { title: 'Submissions', subtitle: 'Manage your portfolio' },
  '/leaderboard': { title: 'Leaderboard', subtitle: 'Global Hall of Fame' },
  '/profile': { title: 'Profile', subtitle: 'Account Identity' },
}

export default function Navbar() {
  const { toggleMobileSidebar, sidebarCollapsed } = useApp()
  const { user } = useAuth()
  const { pathname } = useLocation()
  
  const pageInfo = pathname.startsWith('/hackathons/')
    ? { title: 'Hackathon Details', subtitle: 'Event Overview' }
    : (PAGE_TITLES[pathname] || { title: 'Overview', subtitle: '' })
  const [scrolled, setScrolled] = useState(false)

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
            aria-label="Open navigation menu"
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
                      <span>🚀</span>
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
          <div className="w-[1px] h-6 bg-white/10 mx-1 hidden sm:block" />

          {/* PROFILE */}
          <UserProfileDropdown />
          
        </div>
      </div>
    </motion.header>
  )
}
