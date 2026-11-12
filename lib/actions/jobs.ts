import type { ApplicationData, JobData } from "@/type/Type"

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


export async function applyToJob(data: ApplicationData) {
  const response = await fetch(`${BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    cache: "no-store",
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Failed to submit application")
  }

  return result
}





export async function checkJobApplication(jobId: string, userId: string) {
  const params = new URLSearchParams({ jobId, userId })

  const response = await fetch(
    `${BASE_URL}/applications/check?${params.toString()}`,
    { cache: "no-store" }
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Failed to check application")
  }

  return result as {
    success: boolean
    hasApplied: boolean
  }
}

export async function withdrawApplication(jobId: string, userId: string) {
  const response = await fetch(`${BASE_URL}/applications`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ jobId, userId }),
    cache: "no-store",
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Failed to withdraw application")
  }

  return result
}
