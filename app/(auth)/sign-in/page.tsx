"use client"

import { AuthForm, FormData } from "@/components/auth-form"
import { authClient } from "@/lib/auth-client"

export default function SignInForm() {
  const handleSignIn = async (data: FormData) => {
    const { data: signInResponse, error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: true,
      callbackURL: "/",
    })

    console.log("Sign In response:", signInResponse)
    console.log("Sign In error:", error)
  }

  return <AuthForm mode="sign-in" onSubmit={handleSignIn} />
}
