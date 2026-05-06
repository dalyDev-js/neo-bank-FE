import { LoginForm } from "@/features/auth/components/LoginForm"
import { BrandPanel } from "@/components/shared/BrandPanel"

export default function LoginPage() {
  return (
    <main className="flex min-h-screen">
      <BrandPanel />
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-16 bg-background">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">N</span>
              </div>
              <span className="font-heading font-bold text-lg tracking-tight">NeoBank</span>
            </div>
          </div>
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
