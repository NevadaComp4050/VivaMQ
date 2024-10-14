"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import Cookies from "js-cookie";
import apiClient from "../../../utils/api";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      Cookies.remove("jwt");
      const response = await apiClient.post("/user/login", { email, password });

      if (response.status === 200) {
        const { token } = response.data;

        Cookies.set("jwt", token, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        router.push("/dashboard");
      } else {
        setError("Invalid email or password.");
      }
    } catch (error: any) {
      console.error("An error occurred:", error);
      setError(error.response?.data?.error || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to sign in to your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
        {error && (
          <p className="text-sm text-red-500 text-center mt-2 mb-4 px-4">
            {error}
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
  );
}
