
import { getJobs } from "@/lib/api/jobs"
import { JobData } from "@/type/Type"
import BrowseJobsClient from "../components/BrowseJobsClient"

const BrowseJobsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}) => {
  const search = await searchParams

  const urlSearch = new URLSearchParams()

  Object.entries(search).forEach(([key, value]) => {
    if (typeof value === "string") {
      urlSearch.append(key, value)
    } else if (Array.isArray(value)) {
      value.forEach((item) => urlSearch.append(key, item))
    }
  })

  const jobs: JobData[] = await getJobs(urlSearch.toString())

  return <BrowseJobsClient jobs={jobs} />
}

export default BrowseJobsPage
