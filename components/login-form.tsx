"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Mail, Lock, User, Cloud } from "lucide-react"
import { login, register } from "@/lib/auth"
import { showToast } from "@/lib/toast"

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(loginData.email, loginData.password)
      if (result.success) {
        showToast("Berhasil masuk! Selamat datang kembali.", "success")
        router.push("/dashboard")
      } else {
        showToast(result.message || "Gagal masuk", "error")
      }
    } catch (error) {
      showToast("Terjadi kesalahan saat masuk", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (registerData.password !== registerData.confirmPassword) {
      showToast("Password tidak cocok", "error")
      setIsLoading(false)
      return
    }

    try {
      const result = await register(registerData.name, registerData.email, registerData.password)
      if (result.success) {
        showToast("Akun berhasil dibuat! Silakan masuk.", "success")
        setRegisterData({ name: "", email: "", password: "", confirmPassword: "" })
      } else {
        showToast(result.message || "Gagal membuat akun", "error")
      }
    } catch (error) {
      showToast("Terjadi kesalahan saat membuat akun", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-2xl border-0 bg-slate-800/80 backdrop-blur-xl border border-sky-500/20">
      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto p-3 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl w-fit glow-sky">
          <Cloud className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-sky-300 to-blue-300 bg-clip-text text-transparent">
          Selamat Datang
        </CardTitle>
        <CardDescription className="text-slate-300 text-lg">Kelola file Anda dengan mudah dan aman</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-700/50 border border-slate-600">
            <TabsTrigger
              value="login"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              Masuk
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              Daftar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-6 mt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200 font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-sky-500/20"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-sky-500/20"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-slate-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-semibold py-3 shadow-lg shadow-sky-500/25 glow-sky"
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "Masuk"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-6 mt-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-200 font-medium">
                  Nama Lengkap
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nama lengkap Anda"
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-sky-500/20"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-slate-200 font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="nama@email.com"
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-sky-500/20"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-slate-200 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Buat password"
                    className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-sky-500/20"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-slate-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-slate-200 font-medium">
                  Konfirmasi Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Konfirmasi password"
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-sky-500/20"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-semibold py-3 shadow-lg shadow-sky-500/25 glow-sky"
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "Buat Akun"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
