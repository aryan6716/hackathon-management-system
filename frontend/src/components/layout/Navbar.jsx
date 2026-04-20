import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import UserProfileDropdown from './UserProfileDropdown'
import clsx from 'clsx'

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview & Metrics' },
  '/hackathons': { title: 'Hackathons', subtitle: 'Explore Events' },
  '/teams': { title: 'Teams', subtitle: 'Manage your team' },
  '/submissions': { title: 'Submissions', subtitle: 'Manage your projects' },
  '/leaderboard': { title: 'Leaderboard', subtitle: 'Rankings' },
  '/profile': { title: 'Profile', subtitle: 'Account settings' },
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
    <header 
      className={clsx(
        'fixed top-0 right-0 z-30 flex items-center transition-all duration-300 border-b border-gray-800 bg-gray-900',
        scrolled ? 'h-16' : 'h-20',
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
            <div>
              <h1 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                {pathname === '/dashboard' ? (
                  <>
                    <span>{timeGreeting},</span>
                    <span>{firstName}</span>
                  </>
                ) : pageInfo.title}
              </h1>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                {pageInfo.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: Controls */}
        <div className="flex items-center gap-4">
          <div className="w-[1px] h-6 bg-white/10 mx-1 hidden sm:block" />

          {/* PROFILE */}
          <UserProfileDropdown />
          
        </div>
      </div>
    </header>
  )
}
