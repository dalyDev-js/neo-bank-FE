import type { Metadata } from "next"
import { Syne, DM_Sans } from "next/font/google"
import "./globals.css"
import { QueryClientProviders } from "@/components/providers/QueryClientProviders"
import { AuthProvider } from "@/context/AuthContext"
import { Toaster } from "sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

const syne = Syne({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
})

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "NeoBank — Modern Banking",
  description: "Secure, modern banking beyond boundaries",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} dark h-full`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <QueryClientProviders>
          <AuthProvider>
            <TooltipProvider>
              {children}
              <Toaster
                richColors
                position="top-right"
                toastOptions={{
                  style: {
                    background: "oklch(0.13 0.026 265)",
                    border: "1px solid oklch(1 0 0 / 10%)",
                    color: "oklch(0.94 0.006 265)",
                  },
                }}
              />
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProviders>
      </body>
    </html>
  )
}
