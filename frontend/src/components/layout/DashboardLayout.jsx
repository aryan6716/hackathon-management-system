import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useApp } from '../../context/AppContext'
import clsx from 'clsx'

const DashboardLayout = () => {
  const { sidebarCollapsed } = useApp()

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar />

      <Navbar />

      {/* 🔥 Main Content */}
      <main
        className={clsx(
          'transition-all duration-300 pt-16 min-h-screen',
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        )}
      >
        <div className="p-4 lg:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  )
}

export default DashboardLayout