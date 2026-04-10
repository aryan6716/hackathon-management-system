import React, { createContext, useContext, useEffect, useState } from "react"
import { apiGet } from "../utils/api"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const initAuth = async () => {
      try {
        setLoading(true)

        const token = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")

        // ✅ FIX 1: Load from localStorage first (instant UI)
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }

        // ❌ No token → stop loading
        if (!token) {
          if (isMounted) {
            setUser(null)
            setLoading(false)
          }
          return
        }

        // ✅ Validate user with backend
        const data = await apiGet('/auth/me')

        if (isMounted) {
          const userData = data.user || data
          setUser(userData)
          localStorage.setItem("user", JSON.stringify(userData))
        }

      } catch (err) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")

        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) setLoading(false) // 🔥 ALWAYS RUN
      }
    }

    initAuth()

    return () => { isMounted = false }
  }, [])

  const login = (token, userData) => {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  const updateUser = (newUserData) => {
    const updated = { ...user, ...newUserData }
    setUser(updated)
    localStorage.setItem("user", JSON.stringify(updated))
    return updated
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
