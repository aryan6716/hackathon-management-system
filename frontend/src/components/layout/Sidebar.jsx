import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Zap, Users, Upload, Trophy, User,
  LogOut, ChevronLeft, ChevronRight
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
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/60 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside 
        style={{ 
          width: sidebarCollapsed ? 80 : 288,
          transform: mobileSidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024) ? 'translateX(0)' : 'translateX(-100%)'
        }}
        className={clsx(
          'fixed top-0 left-0 h-full z-50 flex flex-col',
          'bg-gray-900 border-r border-gray-800 transition-all duration-300'
        )}
      >
        {/* Header/Logo */}
        <div className={clsx(
          'flex items-center h-20 px-6 border-b border-white/5',
          sidebarCollapsed ? 'justify-center' : 'justify-between'
        )}>
          {!sidebarCollapsed && (
            <div className="font-semibold text-lg text-white">
              HackathonHub
            </div>
          )}

          {sidebarCollapsed && (
            <div className="font-semibold text-lg text-white">
              H
            </div>
          )}

          <button
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
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
                'relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group',
                isActive ? 'text-white bg-gray-800' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900'
              )}
            >
              {({ isActive }) => (
                <>
                  <Icon className={clsx(
                    "w-5 h-5 transition-all duration-200",
                    isActive ? "text-indigo-400" : "text-gray-500 group-hover:text-gray-400"
                  )} />
                  
                  {!sidebarCollapsed && (
                    <span className="whitespace-nowrap">
                      {label}
                    </span>
                  )}
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
                <p className="text-white text-sm font-medium truncate">
                  {loading ? "..." : (user?.name || "User")}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <p className="text-xs text-gray-500 capitalize">
                    Online
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className={clsx(
              "flex items-center gap-3 text-sm font-medium text-gray-400 hover:text-red-400 rounded-lg transition-all",
              sidebarCollapsed ? "justify-center p-2" : "w-full px-3 py-2 hover:bg-gray-800"
            )}
          >
            <LogOut size={18} className="shrink-0" />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
