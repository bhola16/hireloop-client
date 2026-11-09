"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { deleteJob } from "@/lib/actions/jobs"
import { Trash2Icon } from "lucide-react"

type DeleteJobDialogProps = {
  job: {
    id: string
    title: string
  }
  onDeleted?: (id: string) => void
}

export function DeleteJobDialog({ job, onDeleted }: DeleteJobDialogProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)

      const result = await deleteJob(job.id)

      if (result?.deletedCount > 0) {
        setOpen(false)
        onDeleted?.(job.id)

        toast.add({
          title: "Job Deleted",
          description: `"${job.title}" has been permanently deleted.`,
        })
      } else {
        throw new Error("Job could not be deleted.")
      }
    } catch (error) {
      console.error("Failed to delete job:", error)

      toast.add({
        title: "Deletion Failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong while deleting the job.",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant="destructive"
            size="icon"
            aria-label={`Delete ${job.title}`}
          >
            <Trash2Icon />
          </Button>
        }
      />

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>

          <AlertDialogTitle>Delete this job?</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to permanently delete{" "}
            <strong>{job.title}</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            variant="destructive"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
