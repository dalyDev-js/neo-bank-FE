"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"

import { useRegister } from "@/features/auth/hooks/useAuth"
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
import type { ValidationErrorResponse } from "@/types"

const schema = z.object({
  firstName: z.string().min(2, "Min 2 characters").max(50, "Max 50 characters"),
  lastName: z.string().min(2, "Min 2 characters").max(50, "Max 50 characters"),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Needs uppercase, lowercase, number & special char"
    ),
  phoneNumber: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Valid phone number (10–15 digits)"),
  dateOfBirth: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const inputClass = "rounded-xl h-11 bg-white/5 border-white/10 focus:border-primary/50 focus:bg-white/8 transition-colors placeholder:text-muted-foreground/40"
const labelClass = "text-xs font-medium uppercase tracking-wider"

export function RegisterForm() {
  const router = useRouter()
  const registerMutation = useRegister()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      dateOfBirth: "",
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      await registerMutation.mutateAsync(values)
      toast.success("Account created! Please sign in.")
      router.push("/login")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        const data = error.response?.data
        if (status === 409) {
          toast.error(data?.message ?? "Email already registered")
        } else if (status === 400 && data?.fieldErrors) {
          const fieldErrors = (data as ValidationErrorResponse).fieldErrors
          for (const [field, message] of Object.entries(fieldErrors)) {
            form.setError(field as keyof FormValues, { message: message as string })
          }
        } else {
          toast.error(data?.message ?? "Something went wrong.")
        }
      } else {
        toast.error("Cannot connect to server.")
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          Create account
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Open your NeoBank account in minutes
        </p>
      </div>

      {/* Registration form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass} style={{ color: "oklch(0.52 0.03 265)" }}>First</FormLabel>
                  <FormControl>
                    <Input placeholder="John" className={inputClass} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass} style={{ color: "oklch(0.52 0.03 265)" }}>Last</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" className={inputClass} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass} style={{ color: "oklch(0.52 0.03 265)" }}>Email address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" className={inputClass} {...field} />
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
                <FormLabel className={labelClass} style={{ color: "oklch(0.52 0.03 265)" }}>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" className={inputClass} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass} style={{ color: "oklch(0.52 0.03 265)" }}>Phone number</FormLabel>
                <FormControl>
                  <Input placeholder="+966501234567" className={inputClass} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass} style={{ color: "oklch(0.52 0.03 265)" }}>
                  Date of birth <span style={{ color: "oklch(0.38 0.02 265)" }}>(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input type="date" className={inputClass} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-11 rounded-xl font-semibold text-sm mt-1 emerald-glow transition-all duration-200 active:scale-[0.98]"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Create account
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm" style={{ color: "oklch(0.45 0.025 265)" }}>
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold transition-colors hover:opacity-80"
          style={{ color: "oklch(0.73 0.18 152)" }}
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
