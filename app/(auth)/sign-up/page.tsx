"use client"

import { AuthForm, FormData } from "@/components/auth-form"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function SignUpForm() {
  const router = useRouter()

  const handleSignUp = async (data: FormData) => {
    const { data: signUpResponse, error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      callbackURL: "/",
    })

    if (error) {
      console.error("Sign Up error:", error)
      return
    }

    console.log("Sign Up response:", signUpResponse)

    router.replace("/")
    router.refresh()
  }

  return (
    <main className="flex min-h-svh w-full items-center justify-center px-4 py-10">
      <AuthForm mode="sign-up" onSubmit={handleSignUp} />
    </main>
  )
}
