"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Eye, EyeOff, Cloud, Zap, Sparkles, UserPlus, ArrowRight, CheckCircle } from "lucide-react"
import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json()
    setIsLoading(false)
    if (res.ok) {
      toast({
        title: 'Akun berhasil dibuat!',
        description: 'Silakan login dengan akun Anda.',
        className: 'notification-success text-white border-0',
      })
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } else {
      toast({ title: 'Register Gagal', description: data.error, variant: 'destructive' })
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 rounded-full animate-float"></div>
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/5 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-4 animate-pulse-glow">
              <Cloud className="h-12 w-12 text-white" />
            </div>
            <div className="ml-3">
              <Zap className="h-8 w-8 text-yellow-300 animate-bounce" />
              <Sparkles className="h-6 w-6 text-white ml-2 animate-pulse" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-3">ZipFlow</h1>
          <p className="text-white/90 text-xl font-medium flex items-center justify-center gap-2">
            <UserPlus className="h-5 w-5" />
            Bergabung dengan ZipFlow sekarang
          </p>
        </div>

        {/* Register Card */}
        <Card className="card-modern border-0 shadow-2xl animate-scale-in">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold gradient-text">Buat Akun Baru</CardTitle>
            <CardDescription className="text-gray-600 text-lg">Daftar untuk mulai menggunakan ZipFlow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  👤 Nama Lengkap
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12 text-lg border-2 border-gray-200 focus:border-sky-400 transition-all duration-300 hover-glow"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  📧 Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 text-lg border-2 border-gray-200 focus:border-sky-400 transition-all duration-300 hover-glow"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  🔒 Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 text-lg pr-12 border-2 border-gray-200 focus:border-sky-400 transition-all duration-300 hover-glow"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-4 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  🔐 Konfirmasi Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Ulangi password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-12 text-lg pr-12 border-2 border-gray-200 focus:border-sky-400 transition-all duration-300 hover-glow"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-4 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg font-bold btn-primary text-white border-0 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    Daftar
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 text-lg">
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  className="font-bold text-sky-600 hover:text-sky-700 transition-colors duration-300 underline decoration-2 underline-offset-4"
                >
                  Masuk di sini
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="mt-8 space-y-3 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-3 text-white/90">
            <CheckCircle className="h-5 w-5 text-green-300" />
            <span className="text-sm font-medium">Penyimpanan 5GB gratis</span>
          </div>
          <div className="flex items-center gap-3 text-white/90">
            <CheckCircle className="h-5 w-5 text-green-300" />
            <span className="text-sm font-medium">Akses dari semua perangkat</span>
          </div>
          <div className="flex items-center gap-3 text-white/90">
            <CheckCircle className="h-5 w-5 text-green-300" />
            <span className="text-sm font-medium">Keamanan tingkat enterprise</span>
          </div>
        </div>
      </div>
    </div>
  )
}
