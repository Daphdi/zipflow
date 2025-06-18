"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Eye, EyeOff, Cloud, Zap, Sparkles, Shield, ArrowRight } from "lucide-react"
import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      })
      if (result?.ok) {
        toast({
          title: "🎉 Berhasil Masuk!",
          description: "Selamat datang kembali di ZipFlow",
          className: "notification-success text-white border-0",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "❌ Gagal Masuk",
          description: "Email atau password tidak valid",
          variant: "destructive",
          className: "notification-error text-white border-0",
        })
      }
    } catch (error) {
      toast({
        title: "⚠️ Terjadi Kesalahan",
        description: "Silakan coba lagi nanti",
        variant: "destructive",
        className: "notification-error text-white border-0",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
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
          <h1 className="text-5xl font-bold text-white mb-3 gradient-text-white">ZipFlow</h1>
          <p className="text-white/90 text-xl font-medium flex items-center justify-center gap-2">
            <Shield className="h-5 w-5" />
            Simpan dengan sistem dan temukan dengan mudah
          </p>
        </div>

        {/* Login Card */}
        <Card className="card-modern border-0 shadow-2xl animate-scale-in">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold gradient-text">Masuk ke Akun</CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Masukkan email dan password untuk mengakses ZipFlow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder="Masukkan password"
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
                    Masuk
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 text-lg">
                Belum punya akun?{" "}
                <Link
                  href="/register"
                  className="font-bold text-sky-600 hover:text-sky-700 transition-colors duration-300 underline decoration-2 underline-offset-4"
                >
                  Daftar sekarang
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="text-center text-white/80">
            <Cloud className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm font-medium">Penyimpanan Aman</p>
          </div>
          <div className="text-center text-white/80">
            <Zap className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm font-medium">Akses Cepat</p>
          </div>
          <div className="text-center text-white/80">
            <Shield className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm font-medium">Keamanan Tinggi</p>
          </div>
        </div>
      </div>
    </div>
  )
}
