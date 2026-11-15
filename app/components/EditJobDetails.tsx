
"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { updateJob } from "@/lib/api/jobs"
import type { JobData } from "@/type/Type"
import { Pencil, X } from "lucide-react"

type EditJobDetailsProps = {
  job: JobData
  recruiterId: string
  onUpdated: (updatedJob: JobData) => void
}

type EditJobForm = {
  title: string
  company: string
  category: string
  employmentType: JobData["employmentType"]
  workplaceType: JobData["workplaceType"]
  location: string
  experience: NonNullable<JobData["experience"]>
  salaryMin: string
  salaryMax: string
  currency: JobData["currency"]
  description: string
  responsibilities: string
  requirements: string
  skills: string
  applicationDeadline: string
  status: "active" | "draft" | "closed"
}

const getDateValue = (value?: string) => {
  if (!value) return ""

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? value.slice(0, 10)
    : date.toISOString().slice(0, 10)
}

const getFormValues = (job: JobData): EditJobForm => ({
  title: job.title ?? "",
  company: job.company ?? "",
  category: job.category ?? "",
  employmentType: job.employmentType ?? "full-time",
  workplaceType: job.workplaceType ?? "onsite",
  location: job.location ?? "",
  experience: job.experience ?? "entry",
  salaryMin: job.salaryMin?.toString() ?? "",
  salaryMax: job.salaryMax?.toString() ?? "",
  currency: job.currency ?? "BDT",
  description: job.description ?? "",
  responsibilities: job.responsibilities ?? "",
  requirements: job.requirements ?? "",
  skills: job.skills?.join(", ") ?? "",
  applicationDeadline: getDateValue(job.applicationDeadline),
  status:
    job.status === "draft" || job.status === "closed"
      ? job.status
      : "active",
})

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"

const labelClass = "mb-2 block text-sm font-medium"

export default function EditJobDetails({
  job,
  recruiterId,
  onUpdated,
}: EditJobDetailsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState<EditJobForm>(
    () => getFormValues(job)
  )

  useEffect(() => {
    setFormData(getFormValues(job))
  }, [job])

  const handleChange = <K extends keyof EditJobForm>(
    field: K,
    value: EditJobForm[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleOpen = () => {
    setFormData(getFormValues(job))
    setIsOpen(true)
  }

  const handleClose = () => {
    if (!isSaving) {
      setIsOpen(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!formData.title.trim() || !formData.company.trim()) {
      toast.add({
        title: "Required fields missing",
        description: "Job title and company name are required.",
      })
      return
    }

    const minSalary = formData.salaryMin
      ? Number(formData.salaryMin)
      : undefined

    const maxSalary = formData.salaryMax
      ? Number(formData.salaryMax)
      : undefined

    if (
      (minSalary !== undefined && (!Number.isFinite(minSalary) || minSalary < 0)) ||
      (maxSalary !== undefined && (!Number.isFinite(maxSalary) || maxSalary < 0))
    ) {
      toast.add({
        title: "Invalid salary",
        description: "Please enter valid non-negative salary amounts.",
      })
      return
    }

    if (
      minSalary !== undefined &&
      maxSalary !== undefined &&
      minSalary > maxSalary
    ) {
      toast.add({
        title: "Invalid salary range",
        description: "Minimum salary cannot exceed maximum salary.",
      })
      return
    }

    const updatedData = {
      title: formData.title.trim(),
      company: formData.company.trim(),
      category: formData.category.trim(),
      employmentType: formData.employmentType,
      workplaceType: formData.workplaceType,
      location: formData.location.trim(),
      experience: formData.experience,
      salaryMin: minSalary,
      salaryMax: maxSalary,
      currency: formData.currency,
      description: formData.description.trim(),
      responsibilities: formData.responsibilities.trim(),
      requirements: formData.requirements.trim(),
      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      applicationDeadline: formData.applicationDeadline || undefined,
      status: formData.status,
    }

    try {
      setIsSaving(true)

      const result = await updateJob(
        job._id,
        recruiterId,
        updatedData
      )

      const updatedJob: JobData = {
        ...job,
        ...updatedData,
        ...(result.job ?? {}),
        status: updatedData.status,
      }

      onUpdated(updatedJob)
      setIsOpen(false)

      toast.add({
        title: "Job updated",
        description: "Job details have been updated successfully.",
      })
    } catch (error) {
      toast.add({
        title: "Update failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong while updating the job.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={handleOpen}
        className="rounded-md px-5 py-5"
      >
        <Pencil className="mr-2 size-4" />
        Edit Job
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleClose()
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-job-title"
            className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border bg-background shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-5 py-4 sm:px-6">
              <div>
                <h2
                  id="edit-job-title"
                  className="text-lg font-semibold"
                >
                  Edit Job Details
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Update the information for your job posting.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={isSaving}
                aria-label="Close dialog"
                className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">

                {/* Basic Information */}
                <section className="space-y-4">
                  <h3 className="text-sm font-semibold">
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Job Title *</label>
                      <input
                        required
                        value={formData.title}
                        onChange={(e) =>
                          handleChange("title", e.target.value)
                        }
                        placeholder="e.g. Frontend Developer"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Company Name *</label>
                      <input
                        required
                        value={formData.company}
                        onChange={(e) =>
                          handleChange("company", e.target.value)
                        }
                        placeholder="Company name"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Job Category</label>
                      <input
                        value={formData.category}
                        onChange={(e) =>
                          handleChange("category", e.target.value)
                        }
                        placeholder="e.g. Technology"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Location</label>
                      <input
                        value={formData.location}
                        onChange={(e) =>
                          handleChange("location", e.target.value)
                        }
                        placeholder="e.g. Dhaka, Bangladesh"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </section>

                {/* Job Type */}
                <section className="space-y-4">
                  <h3 className="text-sm font-semibold">
                    Job Requirements
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Employment Type</label>
                      <select
                        value={formData.employmentType}
                        onChange={(e) =>
                          handleChange(
                            "employmentType",
                            e.target.value as JobData["employmentType"]
                          )
                        }
                        className={inputClass}
                      >
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                        <option value="freelance">Freelance</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Workplace Type</label>
                      <select
                        value={formData.workplaceType}
                        onChange={(e) =>
                          handleChange(
                            "workplaceType",
                            e.target.value as JobData["workplaceType"]
                          )
                        }
                        className={inputClass}
                      >
                        <option value="onsite">Onsite</option>
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Experience Level</label>
                      <select
                        value={formData.experience}
                        onChange={(e) =>
                          handleChange(
                            "experience",
                            e.target.value as NonNullable<JobData["experience"]>
                          )
                        }
                        className={inputClass}
                      >
                        <option value="entry">Entry Level</option>
                        <option value="junior">Junior</option>
                        <option value="mid">Mid Level</option>
                        <option value="senior">Senior</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Required Skills</label>
                      <input
                        value={formData.skills}
                        onChange={(e) =>
                          handleChange("skills", e.target.value)
                        }
                        placeholder="React, TypeScript, Node.js"
                        className={inputClass}
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Separate skills with commas.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Salary */}
                <section className="space-y-4">
                  <h3 className="text-sm font-semibold">
                    Salary Information
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className={labelClass}>Currency</label>
                      <select
                        value={formData.currency}
                        onChange={(e) =>
                          handleChange(
                            "currency",
                            e.target.value as JobData["currency"]
                          )
                        }
                        className={inputClass}
                      >
                        <option value="BDT">BDT (৳)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Minimum Salary</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.salaryMin}
                        onChange={(e) =>
                          handleChange("salaryMin", e.target.value)
                        }
                        placeholder="Minimum"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Maximum Salary</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.salaryMax}
                        onChange={(e) =>
                          handleChange("salaryMax", e.target.value)
                        }
                        placeholder="Maximum"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </section>

                {/* Description */}
                <section className="space-y-4">
                  <h3 className="text-sm font-semibold">
                    Job Description
                  </h3>

                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                      rows={5}
                      value={formData.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      placeholder="Describe the job position..."
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Responsibilities</label>
                    <textarea
                      rows={4}
                      value={formData.responsibilities}
                      onChange={(e) =>
                        handleChange("responsibilities", e.target.value)
                      }
                      placeholder="Describe the main responsibilities..."
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Requirements</label>
                    <textarea
                      rows={4}
                      value={formData.requirements}
                      onChange={(e) =>
                        handleChange("requirements", e.target.value)
                      }
                      placeholder="Describe the job requirements..."
                      className={inputClass}
                    />
                  </div>
                </section>

                {/* Status and Deadline */}
                <section className="space-y-4">
                  <h3 className="text-sm font-semibold">
                    Publishing Information
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>
                        Application Deadline
                      </label>
                      <input
                        type="date"
                        value={formData.applicationDeadline}
                        onChange={(e) =>
                          handleChange(
                            "applicationDeadline",
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Job Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          handleChange(
                            "status",
                            e.target.value as EditJobForm["status"]
                          )
                        }
                        className={inputClass}
                      >
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>
                </section>
              </div>

              {/* Footer */}
              <div className="flex flex-col-reverse gap-3 border-t bg-muted/30 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSaving}
                  onClick={handleClose}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving Changes..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
