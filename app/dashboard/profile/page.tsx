"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { User, Calendar, Camera, Save, Shield, Key, Sparkles, Zap, CheckCircle, Lock, Eye } from "lucide-react"

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Assuming you have an API to update the profile
      // Replace this with actual implementation
      toast({
        title: "🎉 Profil Berhasil Diperbarui",
        description: "Informasi profil Anda telah disimpan",
        className: "notification-success text-white border-0",
      })
    } catch (error) {
      toast({
        title: "❌ Gagal Memperbarui Profil",
        description: "Terjadi kesalahan saat menyimpan profil",
        variant: "destructive",
        className: "notification-error text-white border-0",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="flex-1 space-y-8 p-6 bg-gradient-to-br from-slate-50 to-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <SidebarTrigger className="hover-lift" />
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold gradient-text">👤 Profil</h1>
            <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
          </div>
          <p className="text-gray-600 text-lg flex items-center gap-2">
            <Zap className="h-4 w-4 text-sky-500" />
            Kelola informasi profil dan pengaturan akun Anda
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <Card className="card-modern border-0 shadow-lg animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="text-center pb-6">
            <div className="relative mx-auto mb-6">
              <Avatar className="h-32 w-32 mx-auto ring-4 ring-sky-200 shadow-lg">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-br from-sky-400 to-blue-600 text-white text-4xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute -bottom-2 -right-2 h-12 w-12 rounded-full shadow-lg hover-lift bg-white border-2 border-sky-200"
              >
                <Camera className="h-6 w-6 text-sky-600" />
              </Button>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600 text-lg">{user?.email}</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-green-700">Akun Terverifikasi</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Bergabung sejak</span>
                    <p className="font-bold text-gray-900">{user?.createdAt ? formatDate(user.createdAt) : "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Status akun</span>
                    <p className="font-bold text-green-600">Aktif</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card
          className="lg:col-span-2 card-modern border-0 shadow-lg animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="bg-gradient-to-br from-sky-400 to-blue-600 p-3 rounded-xl">
                <User className="h-6 w-6 text-white" />
              </div>
              Edit Profil
            </CardTitle>
            <CardDescription className="text-lg">Perbarui informasi profil Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    👤 Nama Lengkap
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama lengkap"
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="h-12 text-lg border-2 border-gray-200 focus:border-sky-400 transition-all duration-300 hover-glow"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary text-white border-0 h-12 px-8 text-lg font-semibold flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      Simpan Perubahan
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <Card className="card-modern border-0 shadow-lg animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="bg-gradient-to-br from-red-400 to-pink-600 p-3 rounded-xl">
              <Key className="h-6 w-6 text-white" />
            </div>
            Keamanan
          </CardTitle>
          <CardDescription className="text-lg">Kelola pengaturan keamanan akun Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-6 border-2 border-gray-200 rounded-xl hover-lift transition-all duration-300 hover:border-sky-300">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-xl">
                  <Lock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Ubah Password</h3>
                  <p className="text-gray-600">Perbarui password untuk menjaga keamanan akun</p>
                </div>
              </div>
              <Button variant="outline" className="hover-lift h-12 px-6 font-semibold">
                Ubah Password
              </Button>
            </div>

            <div className="flex items-center justify-between p-6 border-2 border-gray-200 rounded-xl hover-lift transition-all duration-300 hover:border-sky-300">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-xl">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Autentikasi Dua Faktor</h3>
                  <p className="text-gray-600">Tambahkan lapisan keamanan ekstra untuk akun Anda</p>
                </div>
              </div>
              <Button variant="outline" className="hover-lift h-12 px-6 font-semibold">
                Aktifkan 2FA
              </Button>
            </div>

            <div className="flex items-center justify-between p-6 border-2 border-gray-200 rounded-xl hover-lift transition-all duration-300 hover:border-sky-300">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-xl">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Sesi Aktif</h3>
                  <p className="text-gray-600">Kelola perangkat yang terhubung ke akun Anda</p>
                </div>
              </div>
              <Button variant="outline" className="hover-lift h-12 px-6 font-semibold">
                Lihat Sesi
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
