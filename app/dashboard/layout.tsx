import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashBoardSidebar } from "../components/DashBoardSidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <DashBoardSidebar></DashBoardSidebar>
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
