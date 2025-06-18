import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopNav } from "@/components/top-nav"
import { FileManagerProvider } from "@/components/file-manager"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FileManagerProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <TopNav />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </FileManagerProvider>
  )
}
