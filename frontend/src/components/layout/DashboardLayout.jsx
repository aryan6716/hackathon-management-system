// import React from 'react'
// import { Outlet } from 'react-router-dom'
// import Sidebar from './Sidebar'
// import Navbar from './Navbar'
// import { useApp } from '../../context/AppContext'
// import clsx from 'clsx'

// export default function DashboardLayout() {
//   const { sidebarCollapsed } = useApp()

//   return (
//     <div className="min-h-screen bg-dark-950 relative overflow-hidden">

//       {/* 🔥 Background decorations (clean + optimized) */}
//       <div className="fixed inset-0 pointer-events-none -z-10">
//         <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-purple/5 rounded-full blur-3xl" />
//         <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-blue/5 rounded-full blur-3xl" />
//       </div>

//       {/* 🔥 Sidebar */}
//       <Sidebar />

//       {/* 🔥 Navbar */}
//       <Navbar />

//       {/* 🔥 Main Content */}
//       <main
//         className={clsx(
//           'transition-all duration-300 pt-16 min-h-screen',
//           sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-60'
//         )}
//       >
//         <div className="p-4 lg:p-6 max-w-7xl mx-auto animate-fade-in">
//           <Outlet />
//         </div>
//       </main>

//     </div>
//   )
// }

export default function DashboardLayout() {
  return (
    <div style={{ color: "white", padding: "20px" }}>
      <h1>APP WORKING ✅</h1>
    </div>
  )
}