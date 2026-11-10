import type { JobData } from "@/type/Type"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const getJobs = async () => {
  const res = await fetch(`${BASE_URL}/jobs`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch jobs")
  }
  return res.json()
}

export const getJobById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/jobs/${id}`)

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch job details")
  }

  return result as JobData & {
    _id: string
    applicants?: number
    createdAt?: string
    status?: string
  }
}
