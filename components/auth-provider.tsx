"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    try {
    const savedUser = localStorage.getItem("zipflow-user")
    if (savedUser) {
        const parsedUser = JSON.parse(savedUser)
        if (parsedUser && typeof parsedUser === 'object') {
          setUser(parsedUser)
    }
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
    setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      const isAuthPage = pathname === "/login" || pathname === "/register"
      if (!user && !isAuthPage) {
        router.push("/login")
      } else if (user && isAuthPage) {
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
    const users = JSON.parse(localStorage.getItem("zipflow-users") || "[]")
    const foundUser = users.find((u: any) => u.email === email && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("zipflow-user", JSON.stringify(userWithoutPassword))
      return true
    }
    return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
    const users = JSON.parse(localStorage.getItem("zipflow-users") || "[]")

    if (users.find((u: any) => u.email === email)) {
      return false
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem("zipflow-users", JSON.stringify(users))
    return true
    } catch (error) {
      console.error('Registration error:', error)
      return false
    }
  }

  const logout = () => {
    try {
    setUser(null)
    localStorage.removeItem("zipflow-user")
    router.push("/login")
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const updateProfile = (data: Partial<User>) => {
    try {
    if (user) {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem("zipflow-user", JSON.stringify(updatedUser))

      const users = JSON.parse(localStorage.getItem("zipflow-users") || "[]")
      const userIndex = users.findIndex((u: any) => u.id === user.id)
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...data }
        localStorage.setItem("zipflow-users", JSON.stringify(users))
      }
      }
    } catch (error) {
      console.error('Profile update error:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
