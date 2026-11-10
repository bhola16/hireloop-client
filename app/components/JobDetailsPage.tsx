"use client"

import { getJobById } from "@/lib/api/jobs"
import type { JobData } from "@/type/Type"
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Clock,
  DollarSign,
  MapPin,
  Pencil,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

type ManagedJob = JobData & {
  id: string
  applicants?: number
  createdAt?: string
  status?: string
}

type JobDetailsPageProps = {
  jobId: string
}

const formatDate = (date?: string) => {
  if (!date) return "Not specified"

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) return date

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const formatSalary = (min?: number, max?: number, currency?: string) => {
  if (min == null && max == null) return "Negotiable"

  const symbol =
    currency === "BDT"
      ? "৳"
      : currency === "USD"
        ? "$"
        : currency === "EUR"
          ? "€"
          : currency === "GBP"
            ? "£"
            : ""

  const formatAmount = (amount: number) =>
    `${symbol}${amount.toLocaleString("en-US")}`

  if (min != null && max != null) {
    return `${formatAmount(min)} - ${formatAmount(max)}`
  }

  if (min != null) return `From ${formatAmount(min)}`

  return `Up to ${formatAmount(max!)}`
}

const getStatus = (status?: string) => {
  if (status === "draft" || status === "closed") return status
  return "active"
}

export default function JobDetailsPage({ jobId }: JobDetailsPageProps) {
  const [job, setJob] = useState<ManagedJob | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch selected job from the backend
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setIsLoading(true)
        setError("")

        const data = await getJobById(jobId)

        setJob({
          ...data,
          id: data._id,
          applicants: data.applicants ?? 0,
          createdAt: data.createdAt ?? "",
          status: getStatus(data.status),
          skills: data.skills ?? [],
        })
      } catch (err) {
        console.error("Failed to fetch job details:", err)

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading job details."
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobDetails()
  }, [jobId])

  // Loading State
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-9 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

          <p className="text-sm text-muted-foreground">
            Loading job details...
          </p>
        </div>
      </div>
    )
  }

  // Error State
  if (error || !job) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <BriefcaseBusiness className="size-12 text-muted-foreground" />

        <h2 className="text-xl font-semibold">Job Not Found</h2>

        <p className="max-w-md text-sm text-muted-foreground">
          {error || "The requested job does not exist."}
        </p>

        <Link
          href="/dashboard/recruiter/jobs"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <ArrowLeft className="size-4" />
          Back to Manage Jobs
        </Link>
      </div>
    )
  }

  const status = getStatus(job.status)

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
      {/* Back Navigation */}
      <Link
        href="/dashboard/recruiter/jobs"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Manage Jobs
      </Link>

      {/* Job Header */}
      <div className="rounded-xl border bg-card p-5 shadow-sm md:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                  status === "active"
                    ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                    : status === "draft"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                      : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                }`}
              >
                {status}
              </span>

              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground capitalize">
                {job.category}
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Building2 className="size-4" />
                {job.company}
              </span>

              <span className="flex items-center gap-2">
                <MapPin className="size-4" />
                {job.location}
              </span>
            </div>
          </div>

          {/* Edit Job */}
          <Link
            href={`/dashboard/recruiter/jobs/edit/${job.id}`}
            title="Edit job"
            aria-label="Edit job"
            className="flex items-center justify-center gap-2 rounded-md border p-2 text-muted-foreground transition hover:bg-muted hover:text-primary"
          >
            <Pencil className="size-4" />
            <span>Edit Job</span>
          </Link>
        </div>
      </div>

      {/* Job Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-5">
          <div className="mb-3 flex items-center gap-2 text-muted-foreground">
            <BriefcaseBusiness className="size-4" />
            <span className="text-sm">Employment Type</span>
          </div>

          <p className="font-semibold capitalize">
            {job.employmentType.replace("-", " ")}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="mb-3 flex items-center gap-2 text-muted-foreground">
            <MapPin className="size-4" />
            <span className="text-sm">Workplace</span>
          </div>

          <p className="font-semibold capitalize">{job.workplaceType}</p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="mb-3 flex items-center gap-2 text-muted-foreground">
            <Users className="size-4" />
            <span className="text-sm">Applicants</span>
          </div>

          <p className="font-semibold">{job.applicants}</p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="mb-3 flex items-center gap-2 text-muted-foreground">
            <DollarSign className="size-4" />
            <span className="text-sm">Salary Range</span>
          </div>

          <p className="font-semibold">
            {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Description */}
          <section className="rounded-xl border bg-card p-5 md:p-6">
            <h2 className="mb-4 text-lg font-semibold">Job Description</h2>

            <p className="text-sm leading-7 whitespace-pre-line text-muted-foreground">
              {job.description || "No description provided."}
            </p>
          </section>

          {/* Responsibilities */}
          <section className="rounded-xl border bg-card p-5 md:p-6">
            <h2 className="mb-4 text-lg font-semibold">Responsibilities</h2>

            <p className="text-sm leading-7 whitespace-pre-line text-muted-foreground">
              {job.responsibilities || "No responsibilities provided."}
            </p>
          </section>

          {/* Requirements */}
          <section className="rounded-xl border bg-card p-5 md:p-6">
            <h2 className="mb-4 text-lg font-semibold">Requirements</h2>

            <p className="text-sm leading-7 whitespace-pre-line text-muted-foreground">
              {job.requirements || "No requirements provided."}
            </p>
          </section>

          {/* Skills */}
          <section className="rounded-xl border bg-card p-5 md:p-6">
            <h2 className="mb-4 text-lg font-semibold">Required Skills</h2>

            {job.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-md bg-muted px-3 py-2 text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No skills specified.
              </p>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Information */}
          <section className="rounded-xl border bg-card p-5 md:p-6">
            <h2 className="mb-5 text-lg font-semibold">Job Information</h2>

            <div className="space-y-5">
              <div>
                <p className="mb-1 text-xs text-muted-foreground">
                  Experience Level
                </p>

                <p className="text-sm font-medium capitalize">
                  {job.experience?.replace("-", " ") || "Not specified"}
                </p>
              </div>

              <div>
                <p className="mb-1 text-xs text-muted-foreground">
                  Job Category
                </p>

                <p className="text-sm font-medium capitalize">{job.category}</p>
              </div>

              <div>
                <p className="mb-1 text-xs text-muted-foreground">Location</p>

                <p className="text-sm font-medium">{job.location}</p>
              </div>

              <div>
                <p className="mb-1 text-xs text-muted-foreground">
                  Employment Type
                </p>

                <p className="text-sm font-medium capitalize">
                  {job.employmentType.replace("-", " ")}
                </p>
              </div>

              <div>
                <p className="mb-1 text-xs text-muted-foreground">
                  Workplace Type
                </p>

                <p className="text-sm font-medium capitalize">
                  {job.workplaceType}
                </p>
              </div>
            </div>
          </section>

          {/* Important Dates */}
          <section className="rounded-xl border bg-card p-5 md:p-6">
            <h2 className="mb-5 text-lg font-semibold">Important Dates</h2>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 size-4 text-muted-foreground" />

                <div>
                  <p className="text-xs text-muted-foreground">
                    Application Deadline
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {formatDate(job.applicationDeadline)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 text-muted-foreground" />

                <div>
                  <p className="text-xs text-muted-foreground">Posted On</p>

                  <p className="mt-1 text-sm font-medium">
                    {formatDate(job.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
