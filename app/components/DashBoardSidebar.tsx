"use client"

import {
  Bookmark,
  BriefcaseBusiness,
  Building,
  Building2,
  CreditCard,
  LayoutDashboard,
  PlusCircle,
  Settings,
  UserRound,
  Users,
  Wallet,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { Logo } from "@/components/navbar"
import { useSession } from "@/lib/auth-client"

const menuItemsByRole = {
  recruiter: [
    {
      id: 1,
      name: "Dashboard",
      url: "/dashboard/recruiter",
      icon: LayoutDashboard,
    },
    {
      id: 2,
      name: "My Company",
      url: "/dashboard/recruiter/company",
      icon: Building2,
    },
    {
      id: 3,
      name: "Manage Jobs",
      url: "/dashboard/recruiter/jobs",
      icon: BriefcaseBusiness,
    },
    {
      id: 4,
      name: "Add Job",
      url: "/dashboard/recruiter/jobs/create",
      icon: PlusCircle,
    },
    {
      id: 5,
      name: "Applications",
      url: "/dashboard/recruiter/applications",
      icon: Users,
    },
    {
      id: 6,
      name: "Settings",
      url: "/dashboard/recruiter/settings",
      icon: Settings,
    },
  ],

  seeker: [
    {
      id: 1,
      name: "Dashboard",
      url: "/dashboard/seeker",
      icon: LayoutDashboard,
    },
    {
      id: 2,
      name: "Jobs",
      url: "/dashboard/seeker/jobs",
      icon: BriefcaseBusiness,
    },
    {
      id: 3,
      name: "Saved Jobs",
      url: "/dashboard/seeker/saved-jobs",
      icon: Bookmark,
    },
    {
      id: 4,
      name: "Applications",
      url: "/dashboard/seeker/applications",
      icon: Users,
    },
    {
      id: 5,
      name: "Billing",
      url: "/dashboard/seeker/billing",
      icon: CreditCard,
    },
    {
      id: 6,
      name: "Settings",
      url: "/dashboard/seeker/settings",
      icon: Settings,
    },
  ],

  admin: [
    {
      id: 1,
      name: "Dashboard",
      url: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    { id: 2, name: "User", url: "/dashboard/admin/users", icon: UserRound },
    {
      id: 3,
      name: "Companies",
      url: "/dashboard/admin/companies",
      icon: Building,
    },
    {
      id: 4,
      name: "Jobs",
      url: "/dashboard/admin/jobs",
      icon: BriefcaseBusiness,
    },
    { id: 5, name: "Payment", url: "/dashboard/admin/payments", icon: Wallet },
    {
      id: 6,
      name: "Settings",
      url: "/dashboard/admin/settings",
      icon: Settings,
    },
  ],
} as const

type UserRole = keyof typeof menuItemsByRole

export function DashBoardSidebar() {
  const { data: session, isPending } = useSession()
  const pathname = usePathname()

  const userRole = session?.user?.role

  console.log("Session:", session)
  console.log("User role:", session?.user?.role)

  const role: UserRole | undefined =
    typeof userRole === "string" &&
    Object.prototype.hasOwnProperty.call(menuItemsByRole, userRole)
      ? (userRole as UserRole)
      : undefined

  const menuItems = role ? menuItemsByRole[role] : []

  return (
    <Sidebar className="top-[88px] !h-[calc(100svh-88px)]">
      <SidebarHeader className="border-b px-4 py-4">
        <Logo />

        <p className="text-xs text-muted-foreground capitalize">
          {isPending
            ? "Loading..."
            : role
              ? `${role} Dashboard`
              : "Role not found"}
        </p>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>

          <SidebarMenu>
            {isPending ? (
              <p className="px-3 py-2 text-sm text-muted-foreground">
                Loading menu...
              </p>
            ) : (
              menuItems.map((item) => {
                const active =
                  pathname === item.url || pathname.startsWith(`${item.url}/`)

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={item.name}
                      render={<Link href={item.url} />}
                    >
                      <item.icon />
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <p className="text-xs text-muted-foreground">© 2026 HireLoop</p>
      </SidebarFooter>
    </Sidebar>
  )
}
