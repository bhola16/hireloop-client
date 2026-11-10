import { getJobs } from "@/lib/api/jobs"

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

  const query = urlSearch.toString()

  const jobs = await getJobs(query)

  return (
    <div>
      <h1>Browse Jobs..</h1>

      <pre>{JSON.stringify(jobs, null, 2)}</pre>
    </div>
  )
}

export default BrowseJobsPage
