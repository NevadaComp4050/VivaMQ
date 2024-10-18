'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useFormState } from 'react-dom'

import { authenticate } from "~/app/actions"

import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

export default function SignIn() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [state, formAction] = useFormState(authenticate, undefined)

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    const result = await authenticate(undefined, formData)
    if (!result) {
      // If no error, assume success and redirect
      router.push("/dashboard")
    } else {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Sign in
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to sign in to your account
          </CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </CardFooter>
        </form>
        {state && (
          <p className="text-sm text-red-500 text-center mt-2 mb-4 px-4">
            {state}
          </p>
        )}
        <div className="text-center mt-2 mb-4">
          <button
            type="button"
            className="text-sm text-blue-600 hover:underline"
            onClick={() => router.push("/register")}
          >
            Create an account...
          </button>
        </div>
      </Card>
    </div>
  )
}