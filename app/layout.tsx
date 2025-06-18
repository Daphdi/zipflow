import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "@/components/providers/session-provider"
import { FileManagerProvider } from "@/components/file-manager"

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })

export const metadata: Metadata = {
  title: "ZipFlow - Simpan dengan Sistem dan Temukan dengan Mudah",
  description: "Platform manajemen file modern untuk menyimpan, mengatur, dan berbagi file dengan mudah",
    generator: 'dap'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <SessionProvider>
          <FileManagerProvider>
            {children}
            <Toaster />
          </FileManagerProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
