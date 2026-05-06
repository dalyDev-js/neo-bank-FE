import { Suspense } from "react"
import { AccountCardSkeleton } from "@/components/shared/LoadingSkeleton"
import { AccountDetail } from "@/features/accounts/components/AccountDetail"

export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <Suspense fallback={<AccountCardSkeleton />}>
      <AccountDetail id={id} />
    </Suspense>
  )
}
