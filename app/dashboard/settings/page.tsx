"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Globe,
  Download,
  Trash2,
  Save,
  Sparkles,
  Zap,
  Moon,
  Sun,
  Volume2,
  Lock,
  Eye,
  Database,
} from "lucide-react"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("id")
  const [autoBackup, setAutoBackup] = useState(true)
  const [soundEffects, setSoundEffects] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "🎉 Pengaturan Disimpan",
      description: "Semua perubahan telah berhasil disimpan",
      className: "notification-success text-white border-0",
    })

    setIsLoading(false)
  }

  const handleClearCache = () => {
    toast({
      title: "🧹 Cache Dibersihkan",
      description: "Cache aplikasi berhasil dibersihkan",
      className: "notification-info text-white border-0",
    })
  }

  const handleExportData = () => {
    toast({
      title: "📥 Data Diekspor",
      description: "Data Anda sedang dipersiapkan untuk diunduh",
      className: "notification-info text-white border-0",
    })
  }

  return (
    <div className="flex-1 space-y-8 p-6 bg-gradient-to-br from-slate-50 to-white min-h-screen">
      {/* Header */}
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold gradient-text">⚙️ Pengaturan</h1>
          <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
        </div>
        <p className="text-gray-600 text-lg flex items-center gap-2">
          <Zap className="h-4 w-4 text-sky-500" />
          Kelola preferensi dan pengaturan aplikasi Anda
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <Card className="card-modern border-0 shadow-lg animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-3 rounded-xl">
                <Settings className="h-6 w-6 text-white" />
              </div>
              Pengaturan Umum
            </CardTitle>
            <CardDescription className="text-lg">Konfigurasi dasar aplikasi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <Label className="font-semibold text-gray-900">Notifikasi</Label>
                    <p className="text-sm text-gray-600">Terima pemberitahuan untuk aktivitas file</p>
                  </div>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    {darkMode ? (
                      <Moon className="h-5 w-5 text-purple-600" />
                    ) : (
                      <Sun className="h-5 w-5 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <Label className="font-semibold text-gray-900">Mode Gelap</Label>
                    <p className="text-sm text-gray-600">Aktifkan tema gelap untuk mata yang nyaman</p>
                  </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Volume2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <Label className="font-semibold text-gray-900">Efek Suara</Label>
                    <p className="text-sm text-gray-600">Putar suara untuk interaksi aplikasi</p>
                  </div>
                </div>
                <Switch checked={soundEffects} onCheckedChange={setSoundEffects} />
              </div>

              <div className="space-y-3">
                <Label className="font-semibold text-gray-900 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Bahasa
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-sky-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">🇮🇩 Bahasa Indonesia</SelectItem>
                    <SelectItem value="en">🇺🇸 English</SelectItem>
                    <SelectItem value="es">🇪🇸 Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="card-modern border-0 shadow-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="bg-gradient-to-br from-red-400 to-pink-600 p-3 rounded-xl">
                <Shield className="h-6 w-6 text-white" />
              </div>
              Privasi & Keamanan
            </CardTitle>
            <CardDescription className="text-lg">Pengaturan keamanan dan privasi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <Lock className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <Label className="font-semibold text-gray-900">Auto Backup</Label>
                    <p className="text-sm text-gray-600">Backup otomatis file ke cloud</p>
                  </div>
                </div>
                <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
              </div>

              <Button variant="outline" className="w-full h-12 justify-start gap-3 hover-lift">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Eye className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Aktivitas Login</p>
                  <p className="text-sm text-gray-600">Lihat riwayat login akun</p>
                </div>
              </Button>

              <Button variant="outline" className="w-full h-12 justify-start gap-3 hover-lift">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Lock className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Ubah Password</p>
                  <p className="text-sm text-gray-600">Perbarui password akun</p>
                </div>
              </Button>

              <Button variant="outline" className="w-full h-12 justify-start gap-3 hover-lift">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Autentikasi 2FA</p>
                  <p className="text-sm text-gray-600">Aktifkan keamanan berlapis</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Storage & Data */}
        <Card className="card-modern border-0 shadow-lg animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="bg-gradient-to-br from-orange-400 to-red-600 p-3 rounded-xl">
                <Database className="h-6 w-6 text-white" />
              </div>
              Penyimpanan & Data
            </CardTitle>
            <CardDescription className="text-lg">Kelola data dan penyimpanan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full h-12 justify-start gap-3 hover-lift"
                onClick={handleExportData}
              >
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Download className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Ekspor Data</p>
                  <p className="text-sm text-gray-600">Unduh semua data Anda</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 justify-start gap-3 hover-lift"
                onClick={handleClearCache}
              >
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <Trash2 className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Bersihkan Cache</p>
                  <p className="text-sm text-gray-600">Hapus file sementara</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 justify-start gap-3 hover-lift text-red-600 border-red-200 hover:bg-red-50"
              >
                <div className="bg-red-100 p-2 rounded-lg">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Hapus Akun</p>
                  <p className="text-sm text-gray-600">Hapus akun secara permanen</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="card-modern border-0 shadow-lg animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="bg-gradient-to-br from-purple-400 to-pink-600 p-3 rounded-xl">
                <Palette className="h-6 w-6 text-white" />
              </div>
              Tampilan
            </CardTitle>
            <CardDescription className="text-lg">Kustomisasi tampilan aplikasi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="font-semibold text-gray-900">Tema Warna</Label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { name: "Sky", color: "bg-sky-500" },
                    { name: "Purple", color: "bg-purple-500" },
                    { name: "Green", color: "bg-green-500" },
                    { name: "Orange", color: "bg-orange-500" },
                  ].map((theme) => (
                    <Button
                      key={theme.name}
                      variant="outline"
                      className="h-16 flex flex-col items-center gap-2 hover-lift"
                    >
                      <div className={`w-6 h-6 rounded-full ${theme.color}`}></div>
                      <span className="text-xs font-medium">{theme.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="font-semibold text-gray-900">Ukuran Font</Label>
                <Select defaultValue="medium">
                  <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-sky-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Kecil</SelectItem>
                    <SelectItem value="medium">Sedang</SelectItem>
                    <SelectItem value="large">Besar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
        <Button
          onClick={handleSave}
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
              Simpan Pengaturan
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
