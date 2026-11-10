"use client"

import { DeleteJobDialog } from "@/app/components/DeleteJobDialog"
import { getJobs } from "@/lib/api/jobs"
import type { JobData } from "@/type/Type"
import {
  BriefcaseBusiness,
  CalendarDays,
  Eye,
  MapPin,
  Pencil,
  Search,
  Users,
  X,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

export type ManagedJob = JobData & {
  id: string
  applicants?: number
  createdAt?: string
}

type ApiJob = JobData & {
  _id?: string
  id?: string
  applicants?: number
  createdAt?: string
}

type JobStatus = "all" | "active" | "draft" | "closed"

const statusStyles: Record<Exclude<JobStatus, "all">, string> = {
  active:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  draft:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  closed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

// Format salary
const formatSalary = (job: ManagedJob) => {
  if (!job.salaryMin && !job.salaryMax) return "Negotiable"

  const formatter = new Intl.NumberFormat("en-US")

  const min = job.salaryMin ? formatter.format(job.salaryMin) : null

  const max = job.salaryMax ? formatter.format(job.salaryMax) : null

  if (min && max) {
    return `${job.currency} ${min} - ${max}`
  }

  return `${job.currency} ${min || max}`
}

// Format date
const formatDate = (date?: string) => {
  if (!date) return "Not specified"

  const parsedDate = new Date(`${date.slice(0, 10)}T00:00:00`)

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not specified"
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

// Normalize job status
const getJobStatus = (status?: string): Exclude<JobStatus, "all"> => {
  if (status === "draft" || status === "closed") {
    return status
  }

  // Support older database records using "published".
  return "active"
}

const ManageJobsPage = () => {
  const [jobs, setJobs] = useState<ManagedJob[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<JobStatus>("all")
  const [selectedJob, setSelectedJob] = useState<ManagedJob | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch Jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true)
        setError("")

        const data: ApiJob[] = await getJobs()

        const formattedJobs: ManagedJob[] = data.map((job) => ({
          ...job,
          id: job.id || job._id || "",
          status: getJobStatus(job.status),
          applicants: job.applicants ?? 0,
          createdAt: job.createdAt ?? "",
          skills: job.skills ?? [],
        }))

        setJobs(formattedJobs)
      } catch (err) {
        console.error("Failed to fetch jobs:", err)

        setError(err instanceof Error ? err.message : "Failed to load jobs.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // View Job
  const handleView = (job: ManagedJob) => {
    setSelectedJob(job)
  }

  // Remove Job From UI After Successful API Deletion
  const handleJobDeleted = (id: string) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id))

    setSelectedJob((prevJob) => (prevJob?.id === id ? null : prevJob))
  }

  // Search and Filter
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        activeFilter === "all" || job.status === activeFilter

      return matchesSearch && matchesStatus
    })
  }, [jobs, searchQuery, activeFilter])

  // Status Counts
  const statusCounts = {
    all: jobs.length,
    active: jobs.filter((job) => job.status === "active").length,
    draft: jobs.filter((job) => job.status === "draft").length,
    closed: jobs.filter((job) => job.status === "closed").length,
  }

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
            onChange={(e) => setSearchQuery(e.target.value)}
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
                    <tr key={job.id} className="transition hover:bg-muted/30">
                      {/* Job Details */}
                      <td className="px-5 py-4">
                        <p className="font-semibold">{job.title}</p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {job.company}
                        </p>

                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="size-3" />
                          {job.location}
                        </p>
                      </td>

                      {/* Job Type */}
                      <td className="px-5 py-4">
                        <p className="capitalize">{job.employmentType}</p>

                        <p className="mt-1 text-xs text-muted-foreground capitalize">
                          {job.workplaceType}
                        </p>
                      </td>

                      {/* Salary */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {formatSalary(job)}
                      </td>

                      {/* Applicants */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="size-4 text-muted-foreground" />
                          {job.applicants ?? 0}
                        </div>
                      </td>

                      {/* Deadline */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {formatDate(job.applicationDeadline)}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${
                            statusStyles[getJobStatus(job.status)]
                          }`}
                        >
                          {getJobStatus(job.status)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/dashboard/recruiter/jobs/${job.id}`}
                            title="View job"
                            aria-label="View job"
                            className="rounded-md border p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                          >
                            <Eye className="size-4" />
                          </Link>

                          <Link
                            href={`/dashb
                              oard/recruiter/jobs/edit/${job.id}`}
                            title="Edit job"
                            aria-label="Edit job"
                            className="rounded-md border p-2 text-muted-foreground transition hover:bg-muted hover:text-primary"
                          >
                            <Pencil className="size-4" />
                          </Link>

                          <DeleteJobDialog
                            job={job}
                            onDeleted={handleJobDeleted}
                          />
                        </div>
                      </td>
                    </tr>
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
              <div
                key={job.id}
                className="space-y-4 rounded-xl border bg-card p-4"
              >
                {/* Job Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold">{job.title}</h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {job.company}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      statusStyles[getJobStatus(job.status)]
                    }`}
                  >
                    {getJobStatus(job.status)}
                  </span>
                </div>

                {/* Job Information */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <MapPin className="size-4" />
                    {job.location}
                  </p>

                  <p className="flex items-center gap-2">
                    <BriefcaseBusiness className="size-4" />
                    <span className="capitalize">
                      {job.employmentType} · {job.workplaceType}
                    </span>
                  </p>

                  <p className="flex items-center gap-2">
                    <Users className="size-4" />
                    {job.applicants ?? 0} Applicants
                  </p>

                  <p className="flex items-center gap-2">
                    <CalendarDays className="size-4" />
                    Deadline: {formatDate(job.applicationDeadline)}
                  </p>
                </div>

                {/* Salary */}
                <div className="border-t pt-3">
                  <p className="text-sm font-semibold">{formatSalary(job)}</p>
                </div>

                {/* Mobile Actions */}
                <div className="flex items-center gap-2 border-t pt-3">
                  <Link
                    href={`/dashboard/recruiter/jobs/${job.id}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition hover:bg-muted"
                  >
                    <Eye className="size-4" />
                    View
                  </Link>

                  <Link
                    href={`/dashboard/recruiter/jobs/edit/${job.id}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition hover:bg-muted"
                  >
                    <Pencil className="size-4" />
                    Edit
                  </Link>

                  <DeleteJobDialog job={job} onDeleted={handleJobDeleted} />
                </div>
              </div>
            ))}

            {filteredJobs.length === 0 && (
              <div className="rounded-xl border bg-card px-4 py-12 text-center text-sm text-muted-foreground">
                No jobs found. Try another search or filter.
              </div>
            )}
          </div>
        </>
      )}

      {/* View Job Dialog */}
      {selectedJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedJob(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="job-dialog-title"
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-background p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          ></div>
        </div>
      )}
    </div>
  )
}

export default ManageJobsPage
