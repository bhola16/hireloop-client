"use client"

import { cn } from "cn"
import { LogOutIcon, MenuIcon, XIcon } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import * as React from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { signOut, useSession } from "@/lib/auth-client"

function Logo({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Link>, "href">) {
  return (
    <Link
      href="/"
      aria-label="HireLoop home"
      className={cn(
        "group flex shrink-0 items-center text-2xl font-bold tracking-tight",
        className
      )}
      {...props}
    >
      <span className="text-[#4d90fe] transition-colors group-hover:text-indigo-500">
        hirel
      </span>

      <span aria-hidden="true" className="flex items-center">
        <span className="size-[0.9em] rounded-full border-[0.13em] border-[#4d90fe] transition-transform duration-300 group-hover:rotate-[-25deg]" />

        <span className="-ml-[0.28em] flex size-[0.9em] items-center justify-center rounded-full border-[0.13em] border-[#f97316] transition-transform duration-300 group-hover:rotate-[25deg]">
          <span className="size-[0.26em] rounded-full bg-[#f97316]" />
        </span>
      </span>
    </Link>
  )
}

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")

  return (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-sm font-bold text-indigo-600 ring-1 ring-indigo-500/20 dark:text-indigo-400">
      {initials || "U"}
    </div>
  )
}

function Navbar() {
  const [open, setOpen] = React.useState(false)
  const [isSigningOut, setIsSigningOut] = React.useState(false)

  const router = useRouter()
  const pathname = usePathname()

  const { data: session, isPending } = useSession()

  const isAuthenticated = !!session?.user
  const userName = session?.user?.name || "User"

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const navLinks = [
    { label: "Browse Jobs", href: "/browse-jobs" },
    { label: "Company", href: "/companies" },
    { label: "Pricing", href: "/pricing" },
    {
      label: "DashBoard",
      href: `/dashboard/${session?.user.role || "seeker"}`,
    },
  ] as const

  const handleSignOut = async () => {
    if (isSigningOut) return

    setIsSigningOut(true)

    try {
      const { error } = await signOut()

      if (error) {
        console.error("Sign out error:", error)
        return
      }

      setOpen(false)
      router.replace("/sign-in")
      router.refresh()
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-background/80 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <nav
        aria-label="Main"
        className="flex w-full items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card/90 px-5 py-3.5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:px-6 lg:px-8"
      >
        {/* Logo */}
        <Logo />

        {/* Desktop navigation */}
        <div className="hidden items-center gap-2 md:flex lg:gap-3">
          {navLinks.map((link) => {
            const active = isActive(link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}

                {active && (
                  <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-indigo-500" />
                )}
              </Link>
            )
          })}

          <Separator orientation="vertical" className="mx-3 h-8" />

          {/* Authentication */}
          {isPending ? (
            <div className="h-10 w-32 animate-pulse rounded-xl bg-muted" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-background/60 py-1.5 pr-3 pl-2">
                <UserAvatar name={userName} />

                <div className="flex flex-col">
                  <span className="max-w-32 truncate text-sm font-semibold text-foreground">
                    {userName}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Welcome back
                  </span>
                </div>
              </div>

              <Button
                onClick={handleSignOut}
                disabled={isSigningOut}
                variant="outline"
                className="h-10 gap-2 rounded-xl border-border/70 text-sm transition-all hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOutIcon className="size-4" />
                {isSigningOut ? "Signing out..." : "Sign Out"}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/sign-in"
                className={buttonVariants({
                  variant: "ghost",
                  className:
                    "h-10 rounded-xl px-5 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-500/10 hover:text-indigo-700 dark:text-indigo-400",
                })}
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className={buttonVariants({
                  className:
                    "h-10 rounded-xl bg-indigo-500 px-5 text-sm font-semibold text-white shadow-sm shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-md hover:shadow-indigo-500/25",
                })}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon-lg"
                aria-label={open ? "Close menu" : "Open menu"}
                className="size-10 rounded-xl border-border/70 md:hidden"
              />
            }
          >
            {open ? (
              <XIcon className="size-5 transition-transform duration-200" />
            ) : (
              <MenuIcon className="size-5 transition-transform duration-200" />
            )}
          </SheetTrigger>

          <SheetContent
            side="right"
            className="flex w-[min(85vw,360px)] flex-col gap-0 border-l border-border/70 bg-background p-0"
          >
            {/* Mobile header */}
            <SheetHeader className="border-b border-border/70 p-5">
              <div className="flex items-center justify-between">
                <Logo />

                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              </div>
            </SheetHeader>

            {/* Mobile user profile */}
            {!isPending && isAuthenticated && (
              <div className="border-b border-border/70 bg-muted/30 p-5">
                <div className="flex items-center gap-3">
                  <UserAvatar name={userName} />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{userName}</p>
                    <p className="text-xs text-muted-foreground">
                      Welcome back to HireLoop
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile links */}

            <nav aria-label="Mobile" className="flex flex-col gap-1 p-4">
              <p className="mb-2 px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Menu
              </p>

              {navLinks.map((link) => {
                const active = isActive(link.href)

                return (
                  <SheetClose
                    key={link.href}
                    nativeButton={false}
                    render={
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex h-12 items-center justify-between rounded-xl px-4 text-sm font-medium transition-all duration-200",
                          active
                            ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                            : "text-foreground/80 hover:bg-muted hover:text-foreground"
                        )}
                      />
                    }
                  >
                    {link.label}

                    {active && (
                      <span className="size-2 rounded-full bg-indigo-500" />
                    )}
                  </SheetClose>
                )
              })}
            </nav>

            {/* Mobile authentication */}
            <div className="mt-auto border-t border-border/70 p-5">
              {isPending ? (
                <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
              ) : isAuthenticated ? (
                <Button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  variant="outline"
                  className="h-11 w-full gap-2 rounded-xl text-sm font-semibold transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOutIcon className="size-4" />
                  {isSigningOut ? "Signing out..." : "Sign Out"}
                </Button>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <SheetClose
                    nativeButton={false}
                    render={
                      <Link
                        href="/sign-in"
                        className={buttonVariants({
                          variant: "outline",
                          className: "h-11 w-full rounded-xl",
                        })}
                      />
                    }
                  >
                    Sign In
                  </SheetClose>

                  <SheetClose
                    nativeButton={false}
                    render={
                      <Link
                        href="/sign-up"
                        className={buttonVariants({
                          className:
                            "h-11 w-full rounded-xl bg-indigo-500 font-semibold text-white hover:bg-indigo-600",
                        })}
                      />
                    }
                  >
                    Get Started
                  </SheetClose>
                </div>
              )}

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Find your next opportunity with HireLoop.
              </p>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}

export { Logo, Navbar }
