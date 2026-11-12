import { DeleteJobDialog } from "@/app/components/DeleteJobDialog"
import type { JobData } from "@/type/Type"
import {
  BriefcaseBusiness,
  CalendarDays,
  Eye,
  MapPin,
  Pencil,
  Users,
} from "lucide-react"
import Link from "next/link"

export type ManagedJob = Partial<Omit<JobData, "status">> & {
  id: string
  title: string
  company: string
  status?: string
  applicants?: number
  createdAt?: string
}

type JobCardProps = {
  job: ManagedJob
  onDeleted?: (id: string) => void
  variant: "table" | "mobile"
  canManage?: boolean
}

const statusStyles: Record<string, string> = {
  active:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  draft:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  closed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

export const getJobStatus = (
  status?: string
): "active" | "draft" | "closed" => {
  if (status === "draft" || status === "closed") {
    return status
  }

  // Support older database records using "published".
  return "active"
}

export const formatSalary = (job: ManagedJob) => {
  if (!job.salaryMin && !job.salaryMax) {
    return "Negotiable"
  }

  const formatter = new Intl.NumberFormat("en-US")

  const min = job.salaryMin ? formatter.format(job.salaryMin) : null
  const max = job.salaryMax ? formatter.format(job.salaryMax) : null

  if (min && max) {
    return `${job.currency || ""} ${min} - ${max}`.trim()
  }

  return `${job.currency || ""} ${min || max}`.trim()
}

export const formatDate = (date?: string) => {
  if (!date) {
    return "Not specified"
  }

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

const JobCard = ({
  job,
  onDeleted,
  variant,
  canManage = true,
}: JobCardProps) => {
  const status = getJobStatus(job.status)

  const viewJobUrl = canManage
    ? `/dashboard/recruiter/jobs/${job.id}`
    : `/jobs/${job.id}`

  // Table layout
  if (variant === "table") {
    return (
      <tr className="transition hover:bg-muted/30">
        {/* Job Details */}
        <td className="px-5 py-4">
          <p className="font-semibold">{job.title}</p>

          <p className="mt-1 text-xs text-muted-foreground">{job.company}</p>

          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            {job.location || "Location not specified"}
          </p>
        </td>

        {/* Job Type */}
        <td className="px-5 py-4">
          <p className="capitalize">{job.employmentType || "Not specified"}</p>

          <p className="mt-1 text-xs text-muted-foreground capitalize">
            {job.workplaceType || "Not specified"}
          </p>
        </td>

        {/* Salary */}
        <td className="px-5 py-4 whitespace-nowrap">{formatSalary(job)}</td>

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
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[status]}`}
          >
            {status}
          </span>
        </td>

        {/* Actions */}
        <td className="px-5 py-4">
          <div className="flex items-center justify-center gap-2">
            <Link
              href={viewJobUrl}
              title="View job"
              aria-label="View job"
              className="rounded-md border p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <Eye className="size-4" />
            </Link>

            {canManage && (
              <>
                <Link
                  href={`/dashboard/recruiter/jobs/edit/${job.id}`}
                  title="Edit job"
                  aria-label="Edit job"
                  className="rounded-md border p-2 text-muted-foreground transition hover:bg-muted hover:text-primary"
                >
                  <Pencil className="size-4" />
                </Link>

                {onDeleted && (
                  <DeleteJobDialog
                    job={job as JobData & { id: string }}
                    onDeleted={onDeleted}
                  />
                )}
              </>
            )}
          </div>
        </td>
      </tr>
    )
  }

  // Mobile / card layout
  return (
    <div className="space-y-4 rounded-xl border bg-card p-4">
      {/* Job Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold">{job.title}</h3>

          <p className="mt-1 text-sm text-muted-foreground">{job.company}</p>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[status]}`}
        >
          {status}
        </span>
      </div>

      {/* Job Information */}
      <div className="space-y-2 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <MapPin className="size-4" />
          {job.location || "Location not specified"}
        </p>

        <p className="flex items-center gap-2">
          <BriefcaseBusiness className="size-4" />
          <span className="capitalize">
            {job.employmentType || "Not specified"} ·{" "}
            {job.workplaceType || "Not specified"}
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

      {/* Actions */}
      <div className="flex items-center gap-2 border-t pt-3">
        <Link
          href={viewJobUrl}
          className="flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition hover:bg-muted"
        >
          <Eye className="size-4" />
          View
        </Link>

        {canManage && (
          <>
            <Link
              href={`/dashboard/recruiter/jobs/edit/${job.id}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition hover:bg-muted"
            >
              <Pencil className="size-4" />
              Edit
            </Link>

            {onDeleted && (
              <DeleteJobDialog
                job={job as JobData & { id: string }}
                onDeleted={onDeleted}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default JobCard
