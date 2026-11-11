"use client"

import type { JobData } from "@/type/Type"
import {
  ArrowUpDown,
  BriefcaseBusiness,
  Clock,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState, type FormEvent } from "react"

type BrowseJobsClientProps = {
  jobs: JobData[]
}

const categories = [
  { label: "Technology", value: "technology" },
  { label: "Design", value: "design" },
  { label: "Marketing", value: "marketing" },
  { label: "Data", value: "data" },
  { label: "Writing", value: "writing" },
  { label: "Finance", value: "finance" },
  { label: "Customer Service", value: "customer-service" },
]

const employmentTypes = [
  { label: "Full-time", value: "full-time" },
  { label: "Part-time", value: "part-time" },
  { label: "Contract", value: "contract" },
  { label: "Internship", value: "internship" },
  { label: "Freelance", value: "freelance" },
]

const BrowseJobsClient = ({ jobs }: BrowseJobsClientProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectedCategory = searchParams.get("category") || ""
  const selectedEmploymentType = searchParams.get("employmentType") || ""

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")

  const [sortBy, setSortBy] = useState("latest")

  // Synchronize search input with URL
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "")
  }, [searchParams])

  // Update URL query parameters
  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    const query = params.toString()

    router.push(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    })
  }

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)

    // Automatically remove the search filter when input becomes empty
    if (!value.trim() && searchParams.has("search")) {
      updateQuery("search", "")
    }
  }

  // Clear search input
  const handleClearSearch = () => {
    setSearchTerm("")
    updateQuery("search", "")
  }

  // Search jobs
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updateQuery("search", searchTerm.trim())
  }

  // Clear all filters
  const handleClearAll = () => {
    setSearchTerm("")
    setSortBy("latest")

    router.push(pathname, {
      scroll: false,
    })
  }

  // Sort jobs by posting date
  const sortedJobs = useMemo(() => {
    const result = [...jobs]

    const getJobDate = (job: JobData) => {
      return new Date(job.createdAt || job.updatedAt || 0).getTime()
    }

    if (sortBy === "latest") {
      result.sort((a, b) => getJobDate(b) - getJobDate(a))
    } else if (sortBy === "oldest") {
      result.sort((a, b) => getJobDate(a) - getJobDate(b))
    }

    return result
  }, [jobs, sortBy])

  // Format salary
  const formatSalary = (job: JobData) => {
    if (job.salaryMin == null && job.salaryMax == null) {
      return "Negotiable"
    }

    const min = job.salaryMin?.toLocaleString() || "—"
    const max = job.salaryMax?.toLocaleString() || "—"

    return `${min} - ${max} ${job.currency || ""}`
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="mb-8 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 px-3">
              <Search className="h-5 w-5 shrink-0 text-slate-400" />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search jobs by title, company, or keywords..."
                className="h-11 w-full bg-transparent px-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />

              {/* Clear Search Button */}
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-red-400 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="h-11 rounded-lg bg-green-600 px-8 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Search Jobs
            </button>
          </div>
        </form>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-slate-600" />

                <h2 className="text-base font-semibold text-slate-900">
                  Filters
                </h2>
              </div>

              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-medium text-green-600 hover:text-green-700"
              >
                Clear all
              </button>
            </div>

            {/* Category Filter */}
            <div className="border-b border-slate-100 pb-6">
              <h3 className="mb-4 text-sm font-semibold text-slate-800">
                Category
              </h3>

              <div className="space-y-3">
                <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-600">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === ""}
                    onChange={() => updateQuery("category", "")}
                    className="h-4 w-4 accent-green-600"
                  />
                  All Categories
                </label>

                {categories.map((category) => (
                  <label
                    key={category.value}
                    className="flex cursor-pointer items-center gap-3 text-sm text-slate-600"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category.value}
                      checked={selectedCategory === category.value}
                      onChange={() => updateQuery("category", category.value)}
                      className="h-4 w-4 accent-green-600"
                    />

                    {category.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Employment Type Filter */}
            <div className="pt-6">
              <h3 className="mb-4 text-sm font-semibold text-slate-800">
                Employment Type
              </h3>

              <div className="space-y-3">
                <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-600">
                  <input
                    type="radio"
                    name="employmentType"
                    checked={selectedEmploymentType === ""}
                    onChange={() => updateQuery("employmentType", "")}
                    className="h-4 w-4 accent-green-600"
                  />
                  All Types
                </label>

                {employmentTypes.map((type) => (
                  <label
                    key={type.value}
                    className="flex cursor-pointer items-center gap-3 text-sm text-slate-600"
                  >
                    <input
                      type="radio"
                      name="employmentType"
                      value={type.value}
                      checked={selectedEmploymentType === type.value}
                      onChange={() => updateQuery("employmentType", type.value)}
                      className="h-4 w-4 accent-green-600"
                    />

                    {type.label}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Job Listings */}
          <section>
            {/* Listing Header */}
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Found {jobs.length} Professional Jobs
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Explore opportunities that match your career goals.
                </p>
              </div>

              {/* Sorting */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-slate-500" />

                <span className="text-sm whitespace-nowrap text-slate-600">
                  Sort by:
                </span>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-green-500"
                >
                  <option value="latest">Latest Date</option>
                  <option value="oldest">Oldest Date</option>
                </select>
              </div>
            </div>

            {/* Job Cards */}
            <div className="space-y-4">
              {sortedJobs.map((job) => (
                <article
                  key={job._id}
                  className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-green-300 hover:shadow-md sm:p-6"
                >
                  {/* Job Title and Company */}
                  <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                        <BriefcaseBusiness className="h-6 w-6" />
                      </div>

                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                          {job.title}
                        </h2>

                        <p className="mt-1 text-sm font-medium text-slate-600">
                          {job.company}
                        </p>
                      </div>
                    </div>

                    <span className="h-fit w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 capitalize">
                      {job.category}
                    </span>
                  </div>

                  {/* Job Information */}
                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>

                    <div className="flex items-center gap-2 capitalize">
                      <BriefcaseBusiness className="h-4 w-4" />
                      {job.employmentType}
                    </div>

                    <div className="flex items-center gap-2 capitalize">
                      <Clock className="h-4 w-4" />
                      {job.experience} Level
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
                    {job.description}
                  </p>

                  {/* Skills */}
                  {job.skills && job.skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.skills.slice(0, 5).map((skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Salary and Details */}
                  <div className="mt-5 flex flex-col justify-between gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-xs text-slate-400">Salary Range</p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {formatSalary(job)}
                      </p>
                    </div>

                    <Link
                      href={`/dashboard/recruiter/jobs/${job._id}`}
                      className="rounded-lg bg-green-600 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-green-700"
                    >
                      View Details
                    </Link>
                  </div>
                </article>
              ))}

              {/* Empty State */}
              {jobs.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
                  <BriefcaseBusiness className="mx-auto h-10 w-10 text-slate-300" />

                  <h3 className="mt-4 text-lg font-semibold text-slate-800">
                    No jobs found
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Try adjusting your search or filters.
                  </p>

                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="mt-5 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default BrowseJobsClient
