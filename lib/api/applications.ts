const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export type ApplicationUsage = {
  success: boolean
  month: string
  limit: number
  totalApplications: number
  freeApplicationsUsed: number
  freeApplicationsRemaining: number
  paymentRequired: boolean
}

export type ApplicationResponse = {
  success: boolean
  message: string
  code?: string
  fee?: number
  currency?: string
  paymentId?: string
  applicationId?: string
  payment?: {
    method: string
    status: string
    amount: number
    currency: string
  } | null
}

export const getApplicationUsage = async (
  userId: string
): Promise<ApplicationUsage> => {
  const params = new URLSearchParams({ userId })

  const response = await fetch(`${BASE_URL}/applications/usage?${params}`, {
    cache: "no-store",
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch application usage")
  }

  return result
}


export const applyForJob = async (
  userId: string,
  jobId: string,
  email: string,
  paymentId?: string
) => {
  const response = await fetch(`${BASE_URL}/applications/apply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      jobId,
      email,
      ...(paymentId ? { paymentId } : {}),
    }),
  })

  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    data,
  }
}


export const makeDemoApplicationPayment = async (
  userId: string,
  jobId: string
) => {
  const response = await fetch(`${BASE_URL}/applications/demo-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, jobId }),
  })

  const result: ApplicationResponse = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Demo payment failed")
  }

  return result
}



export const withdrawApplication = async (userId: string, jobId: string) => {
  const response = await fetch(`${BASE_URL}/applications`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, jobId }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to withdraw application")
  }

  return data
}
