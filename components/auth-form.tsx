"use client"

import * as React from "react"
import Link from "next/link"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Logo } from "@/components/navbar"
import { cn } from "cn"

type Mode = "sign-in" | "sign-up"

export type FormData = {
  name: string
  email: string
  password: string
}

type AuthFormProps = {
  mode: Mode
  onSubmit?: (data: FormData) => void | Promise<void>
}

const modes: { value: Mode; label: string; href: string }[] = [
  { value: "sign-in", label: "Sign In", href: "/sign-in" },
  { value: "sign-up", label: "Sign Up", href: "/sign-up" },
]

const copy: Record<Mode, { title: string; description: string }> = {
  "sign-in": {
    title: "Welcome back",
    description: "Sign in to continue your job search.",
  },
  "sign-up": {
    title: "Create your account",
    description: "Start your journey to your next role.",
  },
}

const inputStyles =
  "flex h-10 w-full rounded-xl border border-border bg-transparent px-3.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive"

function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const [data, setData] = React.useState<FormData>({
    name: "",
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = React.useState(false)

  function handleChange(field: keyof FormData) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setData((prev) => ({ ...prev, [field]: event.target.value }))
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    console.log(
      mode === "sign-in" ? "[sign-in] submitted:" : "[sign-up] submitted:",
      mode === "sign-up" ? data : { email: data.email, password: data.password }
    )

    await onSubmit?.(data)
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl border border-border/70 bg-card/40 p-6 backdrop-blur-xs sm:p-8">
        {/* Brand */}
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo />

          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight">
              {copy[mode].title}
            </h1>

            <p className="text-sm text-muted-foreground">
              {copy[mode].description}
            </p>
          </div>
        </div>

        {/* Toggle between sign in / sign up */}
        <div
          role="tablist"
          aria-label="Authentication"
          className="mt-8 flex rounded-xl border border-border/70 bg-background/40 p-1"
        >
          {modes.map((item) => (
            <Link
              key={item.value}
              href={item.href}
              role="tab"
              aria-selected={mode === item.value}
              className={cn(
                "flex-1 rounded-lg py-2 text-center text-sm font-medium transition-colors",
                mode === item.value
                  ? "bg-indigo-500 text-white hover:bg-indigo-600"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {/* Full Name */}
          {mode === "sign-up" && (
            <FormField label="Full Name" htmlFor="name">
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="John Doe"
                value={data.name}
                onChange={handleChange("name")}
                className={inputStyles}
              />
            </FormField>
          )}

          {/* Email */}
          <FormField label="Email" htmlFor="email">
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="john@example.com"
              value={data.email}
              onChange={handleChange("email")}
              className={inputStyles}
            />
          </FormField>

          {/* Password */}
          <FormField
            label="Password"
            htmlFor="password"
            hint={
              mode === "sign-in" ? (
                <Link
                  href="/sign-in"
                  className="text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Forgot password?
                </Link>
              ) : undefined
            }
          >
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                autoComplete={
                  mode === "sign-up" ? "new-password" : "current-password"
                }
                placeholder={
                  mode === "sign-up" ? "Min. 8 characters" : "••••••••"
                }
                value={data.password}
                onChange={handleChange("password")}
                className={cn(inputStyles, "pr-11")}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOffIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}
              </button>
            </div>
          </FormField>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="mt-1 h-11 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600"
          >
            {mode === "sign-up" ? "Create Account" : "Sign In"}
          </Button>
        </form>

        {/* Divider */}
        <div className="mt-6 flex items-center gap-4">
          <Separator className="flex-1" />

          <span className="text-xs text-muted-foreground">
            or continue with
          </span>

          <Separator className="flex-1" />
        </div>

        {/* Social Providers */}
        <div className="mt-4 flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-11 flex-1 rounded-xl"
          >
            <GoogleIcon />
            Google
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-11 flex-1 rounded-xl"
          >
            <GithubIcon />
            Github
          </Button>
        </div>

        {/* Toggle Link */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "sign-up" ? (
            <>
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-medium text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Sign In
              </Link>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="font-medium text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  )
}

function FormField({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string
  hint?: React.ReactNode
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
        </label>

        {hint}
      </div>

      {children}
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />

      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11.02 11.02 0 0 0 12 23Z"
      />

      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18A10.97 10.97 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84Z"
      />

      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.97 10.97 0 0 0 1.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52Z"
      />
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-4"
    >
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.23c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.74.08-.74 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.53-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.66 1.65.25 2.87.13 3.17.77.84 1.23 1.91 1.23 3.22 0 4.62-2.8 5.65-5.48 5.95.43.37.81 1.1.81 2.22v3.3c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" />
    </svg>
  )
}

export { AuthForm }
export type { Mode }
