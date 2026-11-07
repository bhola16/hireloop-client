"use client"

import { AuthForm, FormData } from "@/components/auth-form"
import { authClient } from "@/lib/auth-client"

export default function SignUpForm() {
  const handleSignUp = async (data: FormData) => {
    const { data: signUpResponse, error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      callbackURL: "/",
    })

    console.log("Sign Up response: ", signUpResponse, error)
  }

  return <AuthForm mode="sign-up" onSubmit={handleSignUp} />
}
