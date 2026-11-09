import type { JobData } from "@/type/Type"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const createJob = async (data: JobData) => {
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const result = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(result?.message || "Failed to create job")
  }

  return result
}

export const deleteJob = async (id: string) => {
  const res = await fetch(`${BASE_URL}/jobs/${id}`, {
    method: "DELETE",
  })

  const result = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(result?.message || "Failed to delete job")
  }

  return result
}

export const getJobs = async () => {
  const res = await fetch(`${BASE_URL}/jobs`, {
    cache: "no-store",
  })

  const result = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(result?.message || "Failed to fetch jobs")
  }

  return result
}
