"use client"

import JobCard, { type ManagedJob } from "@/app/components/JobCard"
import { getJobs } from "@/lib/api/jobs"
import type { JobData } from "@/type/Type"
import { BriefcaseBusiness, Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

type ApiJob = Omit<JobData, "status" | "createdAt"> & {
  _id?: string
  id?: string
  applicants?: number
  status?: string
  createdAt?: string | Date
}

type JobStatus = "all" | "active" | "draft" | "closed"

const ManageJobsPage = () => {
  const [jobs, setJobs] = useState<ManagedJob[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<JobStatus>("all")

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch Jobs
  useEffect(() => {
    let isMounted = true

    const fetchJobs = async () => {
      try {
        setIsLoading(true)
        setError("")

        const data: ApiJob[] = await getJobs()

        if (!isMounted) return

        const formattedJobs: ManagedJob[] = data.map((job) => ({
          ...job,
          id: job.id || job._id || "",
          status: job.status || "active",
          applicants: job.applicants ?? 0,
          createdAt: job.createdAt ? String(job.createdAt) : "",
          skills: job.skills ?? [],
        }))

        setJobs(formattedJobs)
      } catch (err) {
        console.error("Failed to fetch jobs:", err)

        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load jobs.")
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchJobs()

    return () => {
      isMounted = false
    }
  }, [])

  // Remove Job From UI After Successful API Deletion
  const handleJobDeleted = (id: string) => {
    setJobs((previousJobs) => previousJobs.filter((job) => job.id !== id))
  }

  // Search and Filter
  const filteredJobs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return jobs.filter((job) => {
      const matchesSearch =
        (job.title ?? "").toLowerCase().includes(query) ||
        (job.company ?? "").toLowerCase().includes(query)

      const status = job.status === "published" ? "active" : job.status

      const matchesStatus = activeFilter === "all" || status === activeFilter

      return matchesSearch && matchesStatus
    })
  }, [jobs, searchQuery, activeFilter])

  // Status Counts
  const statusCounts = useMemo(
    () => ({
      all: jobs.length,
      active: jobs.filter(
        (job) => job.status === "active" || job.status === "published"
      ).length,
      draft: jobs.filter((job) => job.status === "draft").length,
      closed: jobs.filter((job) => job.status === "closed").length,
    }),
    [jobs]
  )

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Jobs</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Create, track, and manage your job opportunities.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard/recruiter/jobs/create"
            className="rounded-2xl border bg-blue-500 px-4 py-2 text-center text-white transition hover:bg-blue-600"
          >
            Create new Job
          </Link>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BriefcaseBusiness className="size-4" />
            {jobs.length} Total Jobs
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {[
          { label: "Total Jobs", value: statusCounts.all },
          { label: "Active", value: statusCounts.active },
          { label: "Drafts", value: statusCounts.draft },
          { label: "Closed", value: statusCounts.closed },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">{item.label}</p>

            <p className="mt-2 text-2xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 rounded-xl border bg-card p-4 sm:p-5">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="text"
            placeholder="Search by job title or company..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full rounded-lg border border-input bg-background py-2.5 pr-4 pl-10 text-sm transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(["all", "active", "draft", "closed"] as JobStatus[]).map(
            (status) => (
              <button
                key={status}
                type="button"
                onClick={() => setActiveFilter(status)}
                className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                  activeFilter === status
                    ? "bg-primary text-primary-foreground"
                    : "border bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                {status === "all"
                  ? "All Jobs"
                  : status === "active"
                    ? "Active"
                    : status}

                <span className="ml-2 text-xs">{statusCounts[status]}</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="rounded-xl border bg-card px-4 py-12 text-center text-sm text-muted-foreground">
          Loading jobs...
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Jobs Content */}
      {!isLoading && !error && (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="border-b bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-5 py-4 font-medium">Job Details</th>
                    <th className="px-5 py-4 font-medium">Job Type</th>
                    <th className="px-5 py-4 font-medium">Salary</th>
                    <th className="px-5 py-4 font-medium">Applicants</th>
                    <th className="px-5 py-4 font-medium">Deadline</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 text-center font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onDeleted={handleJobDeleted}
                      variant="table"
                    />
                  ))}

                  {filteredJobs.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-12 text-center text-muted-foreground"
                      >
                        No jobs found. Try another search or filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Job Cards */}
          <div className="grid gap-4 md:hidden">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onDeleted={handleJobDeleted}
                variant="mobile"
                canManage={true}
              />
            ))}

            {filteredJobs.length === 0 && (
              <div className="rounded-xl border bg-card px-4 py-12 text-center text-sm text-muted-foreground">
                No jobs found. Try another search or filter.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default ManageJobsPage
