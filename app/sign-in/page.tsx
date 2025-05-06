"use client"

import type React from "react"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

export default function SignInPage() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  
  const [isLoading, setIsLoading] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Simple email validation
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}
    
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    
    // Basic sanitization to prevent XSS
    const sanitizedValue = value.replace(/[<>]/g, '')
    
    setFormData({ ...formData, [id]: sanitizedValue })
    
    // Clear error when user types
    if (errors[id]) {
      setErrors({ ...errors, [id]: "" })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Rate limiting for login attempts on client side
    if (loginAttempts >= 10) {
      toast({
        title: "Too many attempts",
        description: "Please try again after some time or reset your password",
        variant: "destructive",
      })
      return
    }

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setLoginAttempts(prev => prev + 1)

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email.trim(),
        password: formData.password,
        callbackUrl,
      })

      if (!res?.error) {
        // Reset login attempts on success
        setLoginAttempts(0)
        
        toast({
          title: "Sign in successful",
          description: "Redirecting to dashboard...",
        })
        
        // Ensure the redirect works properly
        setTimeout(() => {
          router.push(callbackUrl)
          router.refresh() // Force refresh to ensure data is updated
        }, 1000)
      } else {
        // Handle specific error messages from the server
        if (res.error.includes("locked")) {
          toast({
            title: "Account locked",
            description: "Too many failed attempts. Please try again later or reset your password.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Sign in failed",
            description: "Invalid email or password",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Sign in error:", error)
      toast({
        title: "An error occurred",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <div className="w-full max-w-md">
        <Card className="animate-fadeIn">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? "border-red-500" : ""}
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? "border-red-500" : ""}
                  aria-invalid={!!errors.password}
                />
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>
              <Button 
                type="submit" 
                className="w-full bg-islamic-primary hover:bg-islamic-dark" 
                disabled={isLoading}
                aria-label="Sign in to your account"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => toast({
                  title: "Coming soon",
                  description: "Social login will be available in the future",
                })}
                disabled={isLoading}
              >
                Google
              </Button>
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => toast({
                  title: "Coming soon",
                  description: "Social login will be available in the future",
                })}
                disabled={isLoading}
              >
                Facebook
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

