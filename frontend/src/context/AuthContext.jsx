import React, { createContext, useContext, useEffect, useState } from "react"
import { apiGet, apiPost } from "../utils/api"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 🔥 LOAD USER ON APP START
  useEffect(() => {
    let isMounted = true

    const initAuth = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")

        if (!token) {
          if (isMounted) setLoading(false)
          return
        }

        const data = await apiGet('/auth/me')

        if (isMounted) {
          setUser(data.user || data)
        }

      } catch (err) {
        localStorage.removeItem("token")
        if (isMounted) setUser(null)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    initAuth()

    return () => { isMounted = false }
  }, [])

  // 🔥 LOGIN FUNCTION
  const login = (token, userData) => {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
  }

  // 🔥 LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  // 🔥 UPDATE USER LOCALLY
  const updateUser = (newUserData) => {
    const updated = { ...user, ...newUserData }
    setUser(updated)
    localStorage.setItem("user", JSON.stringify(updated))
    return updated
  }


  // 🔥 GOOGLE LOGIN
  const googleLogin = async (googleData) => {
    try {
      const data = await apiPost('/auth/google', googleData)
      if (data.success) {
        login(data.token, data.user)
        return { success: true }
      }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, googleLogin, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// 🔥 CUSTOM HOOK
export const useAuth = () => useContext(AuthContext)