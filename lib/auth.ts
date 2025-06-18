interface User {
  id: string
  name: string
  email: string
}

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const result = await response.json()
    
    if (result.success) {
      // Simpan user ke localStorage untuk session management
      localStorage.setItem("currentUser", JSON.stringify(result.user))
    }
    
    return result
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, message: "Terjadi kesalahan saat login" }
  }
}

export const register = async (name: string, email: string, password: string) => {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    })

    const result = await response.json()
    
    if (result.success) {
      // Simpan user ke localStorage untuk session management
      const newUser = { id: Date.now().toString(), name, email }
      localStorage.setItem("currentUser", JSON.stringify(newUser))
    }
    
    return result
  } catch (error) {
    console.error('Register error:', error)
    return { success: false, message: "Terjadi kesalahan saat register" }
  }
}

export const logout = () => {
  localStorage.removeItem("currentUser")
}

export const checkAuth = (): User | null => {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("currentUser")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}
