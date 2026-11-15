"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  applyForJob,
  getApplicationUsage,
  withdrawApplication,
  type ApplicationUsage,
} from "@/lib/api/applications"
import { useSession } from "@/lib/auth-client"

type ApplyForJobButtonProps = {
  jobId: string
  status: string
  hasApplied: boolean
  isApplicationStatusLoading?: boolean
  onApplicationChange: (applied: boolean) => void
}

export default function ApplyForJobButton({
  jobId,
  status,
  hasApplied,
  isApplicationStatusLoading = false,
  onApplicationChange,
}: ApplyForJobButtonProps) {
  const router = useRouter()
  const { data: session } = useSession()

  const userId = session?.user?.id
  const email = session?.user?.email

  const [usage, setUsage] = useState<ApplicationUsage | null>(null)
  const [isApplicationLoading, setIsApplicationLoading] = useState(false)

  // Load monthly application usage
  const loadUsage = useCallback(async () => {
    if (!userId) {
      setUsage(null)
      return
    }

    try {
      const result = await getApplicationUsage(userId)
      setUsage(result)
    } catch (error) {
      console.error("Failed to load application usage:", error)

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load application usage."
      )
    }
  }, [userId])

  useEffect(() => {
    loadUsage()
  }, [loadUsage])

  // Apply or withdraw application
  const handleApplyNow = async () => {
    if (isApplicationLoading) return

    if (!userId || !email) {
      toast.error("Please log in to apply for this job.")
      return
    }

    if (status !== "active") {
      toast.error("This job is not accepting applications.")
      return
    }

    setIsApplicationLoading(true)

    try {
      // Withdraw application
      if (hasApplied) {
        const result = await withdrawApplication(userId, jobId)

        if (!result?.success) {
          toast.error(result?.message || "Failed to withdraw your application.")
          return
        }

        onApplicationChange(false)

        toast.success("Application withdrawn successfully!")

        await loadUsage()
        return
      }

      // Submit a new application
      const result = await applyForJob(userId, jobId, email)

      // Payment required
      if (result.status === 402) {
        toast.info("You have used all your free applications.")

        router.push(`/payment?jobId=${encodeURIComponent(jobId)}`)
        return
      }

      // Application failed
      if (!result.ok || !result.data?.success) {
        toast.error(
          result.data?.message || "Failed to submit your application."
        )
        return
      }

      onApplicationChange(true)

      toast.success("Your application has been submitted successfully!")

      await loadUsage()
    } catch (error) {
      console.error("Application operation failed:", error)

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      )
    } finally {
      setIsApplicationLoading(false)
    }
  }

  const isDisabled =
    status !== "active" || isApplicationLoading || isApplicationStatusLoading

  const usagePercentage = usage
    ? Math.min((usage.totalApplications / Math.max(usage.limit, 1)) * 100, 100)
    : 0

  return (
    <div className="space-y-4">
      {/* Monthly Application Usage */}
      {usage && (
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">
              Monthly Application Usage
            </span>

            <span className="text-sm text-muted-foreground">
              {usage.totalApplications} / {usage.limit}
            </span>
          </div>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${usagePercentage}%` }}
            />
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            {usage.freeApplicationsRemaining > 0
              ? `${usage.freeApplicationsRemaining} of your ${usage.limit} free applications remaining this month.`
              : `You have used all ${usage.limit} free applications this month. Additional applications require payment.`}
          </p>
        </div>
      )}

      {/* Apply / Withdraw Button */}
      <Button
        type="button"
        onClick={handleApplyNow}
        disabled={isDisabled}
        variant={hasApplied ? "outline" : "default"}
        className="w-full rounded-md px-5 py-5 text-sm font-medium"
      >
        {isApplicationLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait...
          </>
        ) : isApplicationStatusLoading ? (
          "Checking application..."
        ) : status !== "active" ? (
          "Applications Closed"
        ) : hasApplied ? (
          "Withdraw Application"
        ) : (
          "Apply Now"
        )}
      </Button>
    </div>
  )
}
