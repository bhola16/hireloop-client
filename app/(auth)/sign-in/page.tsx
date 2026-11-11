"use client"

import { AuthForm, FormData } from "@/components/auth-form"
import { authClient } from "@/lib/auth-client"
import { useSearchParams } from "next/navigation"

export default function SignInForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") ?? "/"

  console.log('redirect to ', redirectTo);

  const handleSignIn = async (data: FormData) => {
    const { data: signInResponse, error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: true,
      callbackURL: redirectTo,
    })

    if (error) {
      console.error("Sign in failed:", error)
      return
    }

    // console.log("Sign in successful:", signInResponse)
  }

  return (
    <main className="flex min-h-svh w-full items-center justify-center px-4 py-10">
      <AuthForm mode="sign-in" onSubmit={handleSignIn} />
    </main>
  )
}
