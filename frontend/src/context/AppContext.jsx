import React, { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export function AppProvider({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const toggleSidebar = () => setSidebarCollapsed(p => !p)
  const toggleMobileSidebar = () => setMobileSidebarOpen(p => !p)

  return (
    <AppContext.Provider value={{
      sidebarCollapsed,
      toggleSidebar,
      mobileSidebarOpen,
      toggleMobileSidebar,
      setMobileSidebarOpen,
    }}>
      {children}
    </AppContext.Provider>
  )
}
