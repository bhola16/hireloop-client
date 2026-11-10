"use client"

import { toast } from "@/components/ui/toast"
import { createJob } from "@/lib/actions/jobs"
import type { JobData } from "@/type/Type"
import { Button } from "@base-ui/react"
import { ArrowLeft, BriefcaseBusiness, Plus, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function NewJobPage() {
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const router = useRouter()

  const addSkill = () => {
    const skill = skillInput.trim()

    if (skill && !skills.includes(skill)) {
      setSkills((prev) => [...prev, skill])
      setSkillInput("")
    }
  }

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((item) => item !== skill))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const jobData: JobData = {
      title: String(formData.get("title")),
      company: String(formData.get("company")),
      category: String(formData.get("category")),

      employmentType: formData.get(
        "employmentType"
      ) as JobData["employmentType"],

      workplaceType: formData.get("workplaceType") as JobData["workplaceType"],

      location: String(formData.get("location")),

      experience: (String(formData.get("experience")) ||
        undefined) as JobData["experience"],

      salaryMin: formData.get("salaryMin")
        ? Number(formData.get("salaryMin"))
        : undefined,

      salaryMax: formData.get("salaryMax")
        ? Number(formData.get("salaryMax"))
        : undefined,

      currency: formData.get("currency") as JobData["currency"],

      description: String(formData.get("description")),

      responsibilities: String(formData.get("responsibilities")) || undefined,

      requirements: String(formData.get("requirements")) || undefined,

      skills,

      applicationDeadline:
        String(formData.get("applicationDeadline")) || undefined,

      status: formData.get("status") as JobData["status"],
    }

    try {
      const result = await createJob(jobData)

      if (result.insertedId) {
        // console.log("Job created successfully:", result)
        toast.add({
          title: "Job Created",
          description: "Te job has been successfully created.",
        })
      }
      router.push("/dashboard/recruiter/jobs")

    } catch (error) {
      toast.close("Failed to create a new job")
    }
  }

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"

  const labelClass = "mb-2 block text-sm font-medium"

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Link
            href="/dashboard/recruiter/jobs"
            className="mt-1 rounded-lg border p-2 transition hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
          </Link>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Create a New Job
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Fill in the details below to publish a new job opportunity.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BriefcaseBusiness className="size-4" />
          Recruiter Portal
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <section className="rounded-xl border bg-card p-5 sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Basic Information</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Provide the essential information about this position.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="title" className={labelClass}>
                Job Title <span className="text-destructive">*</span>
              </label>

              <input
                id="title"
                name="title"
                required
                placeholder="e.g. Senior Frontend Developer"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="company" className={labelClass}>
                Company Name <span className="text-destructive">*</span>
              </label>

              <input
                id="company"
                name="company"
                required
                placeholder="Enter company name"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="category" className={labelClass}>
                Job Category <span className="text-destructive">*</span>
              </label>

              <select
                id="category"
                name="category"
                required
                defaultValue=""
                className={inputClass}
              >
                <option value="" disabled>
                  Select category
                </option>
                <option value="technology">Technology</option>
                <option value="engineering">Engineering</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="finance">Finance & Accounting</option>
                <option value="sales">Sales</option>
                <option value="education">Education</option>
                <option value="healthcare">Healthcare</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </section>

        {/* Employment Details */}
        <section className="rounded-xl border bg-card p-5 sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Employment Details</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Specify the type and location of the job.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="employmentType" className={labelClass}>
                Employment Type <span className="text-destructive">*</span>
              </label>

              <select
                id="employmentType"
                name="employmentType"
                required
                defaultValue=""
                className={inputClass}
              >
                <option value="" disabled>
                  Select employment type
                </option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>

            <div>
              <label htmlFor="workplaceType" className={labelClass}>
                Workplace Type <span className="text-destructive">*</span>
              </label>

              <select
                id="workplaceType"
                name="workplaceType"
                required
                defaultValue=""
                className={inputClass}
              >
                <option value="" disabled>
                  Select workplace type
                </option>
                <option value="onsite">On-site</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label htmlFor="location" className={labelClass}>
                Job Location <span className="text-destructive">*</span>
              </label>

              <input
                id="location"
                name="location"
                required
                placeholder="e.g. Dhaka, Bangladesh"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="experience" className={labelClass}>
                Experience Level
              </label>

              <select
                id="experience"
                name="experience"
                defaultValue=""
                className={inputClass}
              >
                <option value="">Select experience level</option>
                <option value="entry">Entry Level</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>
        </section>

        {/* Salary Information */}
        <section className="rounded-xl border bg-card p-5 sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Salary Information</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Provide the expected compensation for this position.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="salaryMin" className={labelClass}>
                Minimum Salary
              </label>

              <input
                id="salaryMin"
                name="salaryMin"
                type="number"
                min="0"
                placeholder="e.g. 30000"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="salaryMax" className={labelClass}>
                Maximum Salary
              </label>

              <input
                id="salaryMax"
                name="salaryMax"
                type="number"
                min="0"
                placeholder="e.g. 50000"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="currency" className={labelClass}>
                Currency
              </label>

              <select
                id="currency"
                name="currency"
                defaultValue="BDT"
                className={inputClass}
              >
                <option value="BDT">BDT (৳)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Job Description */}
        <section className="rounded-xl border bg-card p-5 sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Job Description</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Describe the role and what you expect from candidates.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="description" className={labelClass}>
                Job Description <span className="text-destructive">*</span>
              </label>

              <textarea
                id="description"
                name="description"
                required
                rows={5}
                placeholder="Describe the job position, team, and role..."
                className={`${inputClass} resize-y`}
              />
            </div>

            <div>
              <label htmlFor="responsibilities" className={labelClass}>
                Responsibilities
              </label>

              <textarea
                id="responsibilities"
                name="responsibilities"
                rows={5}
                placeholder="List the main responsibilities..."
                className={`${inputClass} resize-y`}
              />
            </div>

            <div>
              <label htmlFor="requirements" className={labelClass}>
                Requirements
              </label>

              <textarea
                id="requirements"
                name="requirements"
                rows={5}
                placeholder="Describe the qualifications and requirements..."
                className={`${inputClass} resize-y`}
              />
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="rounded-xl border bg-card p-5 sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Required Skills</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Add skills that candidates should have for this position.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addSkill()
                }
              }}
              placeholder="e.g. React, TypeScript, Node.js"
              className={inputClass}
            />

            <Button
              type="button"
              onClick={addSkill}
              className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              <Plus className="size-4" />
              Add
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
              >
                {skill}

                <Button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  aria-label={`Remove ${skill}`}
                  className="rounded-full hover:text-destructive"
                >
                  <X className="size-3.5" />
                </Button>
              </span>
            ))}
          </div>
        </section>

        {/* Application Settings */}
        <section className="rounded-xl border bg-card p-5 sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Application Settings</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Set the deadline and status for this job.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="applicationDeadline" className={labelClass}>
                Application Deadline
              </label>

              <input
                id="applicationDeadline"
                name="applicationDeadline"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className={inputClass}
              />
            </div>

            {/* Job Status */}
            <div>
              <label htmlFor="status" className={labelClass}>
                Job Status
              </label>

              <select
                id="status"
                name="status"
                defaultValue="active"
                className={inputClass}
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <Link
            href="/dashboard/recruiter/jobs"
            className="rounded-lg border px-5 py-2.5 text-center text-sm font-medium transition hover:bg-muted"
          >
            Cancel
          </Link>

          <Button
            type="button"
            onClick={() => console.log("Save as draft")}
            className="rounded-lg border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
          >
            Save as Draft
          </Button>

          <Button
            type="submit"
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Publish Job
          </Button>
        </div>
      </form>
    </div>
  )
}
