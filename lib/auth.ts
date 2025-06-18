interface User {
  id: string
  name: string
  email: string
}

export const login = async (email: string, password: string) => {
  // Simulasi login - dalam implementasi nyata, ini akan memanggil API
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const user = users.find((u: User) => u.email === email)

  if (!user) {
    return { success: false, message: "Email tidak ditemukan" }
  }

  // Dalam implementasi nyata, password akan di-hash
  const storedPassword = localStorage.getItem(`password_${user.id}`)
  if (storedPassword !== password) {
    return { success: false, message: "Password salah" }
  }

  localStorage.setItem("currentUser", JSON.stringify(user))
  return { success: true, user }
}

export const register = async (name: string, email: string, password: string) => {
  const users = JSON.parse(localStorage.getItem("users") || "[]")

  // Cek apakah email sudah terdaftar
  if (users.find((u: User) => u.email === email)) {
    return { success: false, message: "Email sudah terdaftar" }
  }

  const newUser: User = {
    id: Date.now().toString(),
    name,
    email,
  }

  users.push(newUser)
  localStorage.setItem("users", JSON.stringify(users))
  localStorage.setItem(`password_${newUser.id}`, password)

  return { success: true, user: newUser }
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
