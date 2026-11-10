import JobDetailsPage from "@/app/components/JobDetailsPage"

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  return <JobDetailsPage jobId={id} />
}
