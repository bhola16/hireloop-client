export type JobData = {
  _id: string
  title: string
  company: string
  category: string

  employmentType:
    "full-time" | "part-time" | "contract" | "internship" | "freelance"

  workplaceType: "onsite" | "remote" | "hybrid"

  location: string

  experience?: "entry" | "junior" | "mid" | "senior" | "expert"

  salaryMin?: number
  salaryMax?: number
  currency: "BDT" | "USD" | "EUR" | "GBP"

  description: string
  responsibilities?: string
  requirements?: string

  skills: string[]
  applicationDeadline?: string

  status?: "draft" | "published"
  updatedAt: string
  createdAt: string
}
