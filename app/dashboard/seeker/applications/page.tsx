"use client"

import { withdrawApplication } from "@/lib/actions/jobs"
import { useSession } from "@/lib/auth-client"
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Search,
  X,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

type Application = {
  _id: string
  jobId: string
  userId: string
  email: string
  jobTitle: string
  companyName: string
  location?: string
  employmentType?: string
  workplaceType?: string
  status: string
  appliedAt: string
}

type FilterStatus = "all" | "pending" | "reviewed" | "accepted" | "rejected"

const statusStyles: Record<string, string> = {
  pending:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400",
  reviewed:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-400",
  accepted:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400",
  rejected:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400",
}

const statusDotStyles: Record<string, string> = {
  pending: "bg-amber-500",
  reviewed: "bg-blue-500",
  accepted: "bg-emerald-500",
  rejected: "bg-red-500",
}

const formatDate = (date?: string) => {
  if (!date) return "Date unavailable"

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable"
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const filterOptions: FilterStatus[] = [
  "all",
  "pending",
  "reviewed",
  "accepted",
  "rejected",
]

const SeekerApplicationPage = () => {
  const { data: session, isPending: isSessionLoading } = useSession()
  const user = session?.user

  const [applications, setApplications] = useState<Application[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  // Fetch applications
  useEffect(() => {
    if (isSessionLoading) return

    if (!user?.id) {
      setApplications([])
      setIsLoading(false)
      return
    }

    let isMounted = true

    const fetchApplications = async () => {
      try {
        setIsLoading(true)
        setError("")

        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

        const response = await fetch(
          `${baseUrl}/applications/seeker/${encodeURIComponent(user.id)}`,
          {
            cache: "no-store",
            credentials: "include",
          }
        )

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || "Failed to load applications")
        }

        if (isMounted) {
          setApplications(result.applications ?? [])
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading applications."
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchApplications()

    return () => {
      isMounted = false
    }
  }, [isSessionLoading, user?.id, retryCount])

  // Withdraw application
  const handleWithdraw = async (application: Application) => {
    const confirmed = window.confirm(
      `Are you sure you want to withdraw your application for ${application.jobTitle}?`
    )

    if (!confirmed || !user?.id) return

    try {
      setWithdrawingId(application._id)

      const result = await withdrawApplication(application.jobId, user.id)

      if (!result?.success) {
        throw new Error(result?.message || "Failed to withdraw application")
      }

      setApplications((previous) =>
        previous.filter((item) => item._id !== application._id)
      )
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Failed to withdraw application."
      )
    } finally {
      setWithdrawingId(null)
    }
  }

  // Search and filter
  const filteredApplications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return applications.filter((application) => {
      const matchesSearch =
        application.jobTitle?.toLowerCase().includes(query) ||
        application.companyName?.toLowerCase().includes(query)

      const matchesStatus =
        activeFilter === "all" || application.status === activeFilter

      return matchesSearch && matchesStatus
    })
  }, [applications, searchQuery, activeFilter])

  // Application counts
  const counts = useMemo(
    () => ({
      all: applications.length,
      pending: applications.filter((item) => item.status === "pending").length,
      reviewed: applications.filter((item) => item.status === "reviewed")
        .length,
      accepted: applications.filter((item) => item.status === "accepted")
        .length,
      rejected: applications.filter((item) => item.status === "rejected")
        .length,
    }),
    [applications]
  )

  // Loading state
  if (isSessionLoading || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-sm text-muted-foreground">
            Loading your applications...
          </p>
        </div>
      </div>
    )
  }

  // Authentication state
  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border bg-card p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BriefcaseBusiness className="size-7" />
          </div>

          <h2 className="mt-5 text-lg font-semibold">Sign in required</h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Please sign in to view and track your job applications.
          </p>

          <Link
            href="/sign-in"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen w-full bg-muted/20">
      <div className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6 sm:space-y-8 sm:px-6 sm:py-8 lg:px-8">
        {/* Page Header */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <BriefcaseBusiness className="size-4" />
              Career dashboard
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              My Applications
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Track your job applications and stay updated on your application
              progress.
            </p>
          </div>

          <Link
            href="/browse-jobs"
            className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 sm:w-auto"
          >
            <Search className="size-4" />
            Explore Jobs
          </Link>
        </section>

        {/* Summary Cards */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[
            {
              label: "Total Applications",
              value: counts.all,
              icon: BriefcaseBusiness,
              iconStyle: "bg-primary/10 text-primary",
            },
            {
              label: "Pending",
              value: counts.pending,
              icon: Clock3,
              iconStyle:
                "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
            },
            {
              label: "Reviewed",
              value: counts.reviewed,
              icon: Search,
              iconStyle:
                "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
            },
            {
              label: "Accepted",
              value: counts.accepted,
              icon: CheckCircle2,
              iconStyle:
                "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
            },
            {
              label: "Rejected",
              value: counts.rejected,
              icon: X,
              iconStyle:
                "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400",
            },
          ].map((item) => {
            const Icon = item.icon

            return (
              <div
                key={item.label}
                className="min-w-0 rounded-2xl border bg-card p-3 shadow-sm transition hover:shadow-md sm:p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`flex size-9 shrink-0 items-center justify-center rounded-xl sm:size-10 ${item.iconStyle}`}
                  >
                    <Icon className="size-4 sm:size-5" />
                  </div>

                  <span className="text-xl font-bold tabular-nums sm:text-2xl">
                    {item.value}
                  </span>
                </div>

                <p className="mt-3 truncate text-xs font-medium text-muted-foreground sm:text-sm">
                  {item.label}
                </p>
              </div>
            )
          })}
        </section>

        {/* Search and Filters */}
        <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="p-4 sm:p-5">
            <div className="relative">
              <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                placeholder="Search jobs or companies..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-background pr-10 pl-10 text-sm transition outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
              />

              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchQuery("")}
                  className="absolute top-1/2 right-3 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>

          <div className="border-t px-4 py-3 sm:px-5">
            <div className="-mx-1 flex [scrollbar-width:none] gap-2 overflow-x-auto px-1 pb-1 [&::-webkit-scrollbar]:hidden">
              {filterOptions.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setActiveFilter(status)}
                  className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-lg px-3.5 text-xs font-semibold capitalize transition sm:text-sm ${
                    activeFilter === status
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {status === "all" ? "All applications" : status}

                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[11px] tabular-nums ${
                      activeFilter === status
                        ? "bg-primary-foreground/15 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {counts[status]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 sm:flex-row sm:items-center sm:justify-between dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            <p>{error}</p>

            <button
              type="button"
              onClick={() => setRetryCount((previous) => previous + 1)}
              className="w-fit font-semibold underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        )}

        {/* Applications Section */}
        {!error && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold tracking-tight">
                  Your applications
                </h2>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {filteredApplications.length}{" "}
                  {filteredApplications.length === 1
                    ? "application"
                    : "applications"}{" "}
                  found
                </p>
              </div>
            </div>

            {/* Application Cards */}
            {filteredApplications.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredApplications.map((application) => (
                  <article
                    key={application._id}
                    className="group min-w-0 overflow-hidden rounded-2xl border bg-card shadow-sm transition duration-200 hover:border-primary/30 hover:shadow-md"
                  >
                    <div className="p-4 sm:p-5 lg:p-6">
                      {/* Card Header */}
                      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:size-14">
                            <Building2 className="size-5 sm:size-6" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/jobs/${application.jobId}`}
                              className="block text-base leading-snug font-bold tracking-tight break-words transition hover:text-primary sm:text-lg"
                            >
                              {application.jobTitle}
                            </Link>

                            <p className="mt-1.5 flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
                              <Building2 className="size-3.5 shrink-0" />
                              <span className="truncate">
                                {application.companyName}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Status */}
                        <span
                          className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${
                            statusStyles[application.status] ??
                            "border-border bg-muted text-muted-foreground"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              statusDotStyles[application.status] ??
                              "bg-current"
                            }`}
                          />
                          {application.status}
                        </span>
                      </div>

                      {/* Job Details */}
                      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-t pt-4">
                        {application.location && (
                          <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                            <MapPin className="size-4 shrink-0" />
                            <span className="break-words">
                              {application.location}
                            </span>
                          </div>
                        )}

                        {application.employmentType && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground capitalize sm:text-sm">
                            <BriefcaseBusiness className="size-4 shrink-0" />
                            {application.employmentType.replace("-", " ")}
                          </div>
                        )}

                        {application.workplaceType && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground capitalize sm:text-sm">
                            <Clock3 className="size-4 shrink-0" />
                            {application.workplaceType}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="flex flex-col gap-3 border-t bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 lg:px-6">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                        <CalendarDays className="size-4 shrink-0" />
                        <span>Applied on</span>
                        <span className="font-semibold text-foreground">
                          {formatDate(application.appliedAt)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-2 sm:flex sm:items-center">
                        <Link
                          href={`/jobs/${application.jobId}`}
                          className="inline-flex h-10 items-center justify-center rounded-lg border bg-background px-4 text-sm font-semibold transition hover:bg-muted"
                        >
                          View Job
                        </Link>

                        {application.status === "pending" && (
                          <button
                            type="button"
                            disabled={withdrawingId === application._id}
                            onClick={() => handleWithdraw(application)}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 bg-background px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                          >
                            <X className="size-4" />
                            {withdrawingId === application._id
                              ? "Withdrawing..."
                              : "Withdraw"}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="rounded-2xl border bg-card px-5 py-14 text-center sm:py-16">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                  <BriefcaseBusiness className="size-7" />
                </div>

                <h3 className="mt-4 text-base font-bold">
                  {applications.length === 0
                    ? "No applications yet"
                    : "No applications found"}
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  {applications.length === 0
                    ? "You haven't applied for any jobs yet. Explore available opportunities and submit your first application."
                    : "No applications match your current search or filter. Try changing your search or selecting another status."}
                </p>

                {applications.length === 0 ? (
                  <Link
                    href="/browse-jobs"
                    className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                  >
                    Explore Jobs
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("")
                      setActiveFilter("all")
                    }}
                    className="mt-5 inline-flex h-10 items-center justify-center rounded-xl border px-5 text-sm font-semibold transition hover:bg-muted"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  )
}

export default SeekerApplicationPage
