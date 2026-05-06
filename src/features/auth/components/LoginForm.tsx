"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useLogin } from "@/features/auth/hooks/useAuth"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type FormValues = z.infer<typeof schema>

export function LoginForm() {
  const { login } = useAuth()
  const loginMutation = useLogin()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(values: FormValues) {
    try {
      const data = await loginMutation.mutateAsync(values)
      login(data.user)
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status
      if (status === 401) {
        toast.error("Invalid email or password")
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    }
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Sign in to your NeoBank account
        </p>
      </div>

      {/* Email / Password form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium uppercase tracking-wider" style={{ color: "oklch(0.52 0.03 265)" }}>
                  Email address
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="rounded-xl h-11 bg-white/5 border-white/10 focus:border-primary/50 focus:bg-white/8 transition-colors placeholder:text-muted-foreground/40"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium uppercase tracking-wider" style={{ color: "oklch(0.52 0.03 265)" }}>
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="rounded-xl h-11 bg-white/5 border-white/10 focus:border-primary/50 transition-colors placeholder:text-muted-foreground/40"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-11 rounded-xl font-semibold text-sm mt-2 emerald-glow transition-all duration-200 active:scale-[0.98]"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Sign in
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm" style={{ color: "oklch(0.45 0.025 265)" }}>
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold transition-colors hover:opacity-80"
          style={{ color: "oklch(0.73 0.18 152)" }}
        >
          Create one
        </Link>
      </p>
    </div>
  )
}
