"use client"

import * as React from "react"
import Link from "next/link"
import { MenuIcon } from "lucide-react"
import { cn } from "cn"

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

const navLinks = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/companies" },
  { label: "Pricing", href: "/pricing" },
]

function Logo({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Link>, "href">) {
  return (
    <Link
      href="/"
      aria-label="hireloop home"
      className={cn(
        "flex shrink-0 items-center text-2xl font-bold tracking-tight",
        className
      )}
      {...props}
    >
      <span className="text-[#4d90fe]">hirel</span>
      <span aria-hidden="true" className="flex items-center">
        <span className="size-[0.9em] rounded-full border-[0.13em] border-[#4d90fe]" />
        <span className="-ml-[0.28em] flex size-[0.9em] items-center justify-center rounded-full border-[0.13em] border-[#f97316]">
          <span className="size-[0.26em] rounded-full bg-[#f97316]" />
        </span>
      </span>
      <span className="text-[#f97316]">p</span>
    </Link>
  )
}

function Navbar() {
  const [open, setOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background p-4 sm:p-6 lg:p-8">
      <nav
        aria-label="Main"
        className="flex w-full items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card px-5 py-4 sm:px-6 lg:px-10"
      >
        <Logo />

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex lg:gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-foreground/90 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}

          <Separator orientation="vertical" className="h-8 self-center" />

          <Link
            href="/sign-in"
            className="text-sm font-medium text-indigo-500 transition-colors hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Sign In
          </Link>

          <Button
            render={<Link href="/sign-up" />}
            className="h-10 rounded-lg bg-indigo-500 px-5 text-white hover:bg-indigo-600"
          >
            Get Started
          </Button>
        </div>

        {/* Mobile navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon-lg"
                aria-label="Open menu"
                className="md:hidden"
              />
            }
          >
            <MenuIcon />
          </SheetTrigger>

          <SheetContent side="right">
            <SheetHeader className="flex-row items-center">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <Logo onClick={() => setOpen(false)} />
            </SheetHeader>

            <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
              {navLinks.map((link) => (
                <SheetClose
                  key={link.href}
                  render={
                    <Link
                      href={link.href}
                      className="flex h-11 items-center rounded-lg px-4 text-base text-foreground/90 transition-colors hover:bg-muted hover:text-foreground"
                    />
                  }
                >
                  {link.label}
                </SheetClose>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-2.5 px-4 pb-4">
              <Separator />
              <SheetClose
                render={
                  <Link
                    href="/sign-in"
                    className={buttonVariants({
                      variant: "outline",
                      className: "h-11 w-full",
                    })}
                  />
                }
              >
                Sign In
              </SheetClose>
              <SheetClose
                render={
                  <Link
                    href="/sign-up"
                    className={buttonVariants({
                      className:
                        "h-11 w-full bg-indigo-500 text-white hover:bg-indigo-600",
                    })}
                  />
                }
              >
                Get Started
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}

export { Navbar }
