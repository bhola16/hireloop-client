import { cn } from "cn"

console.log("w:", cn("w-3/4", "w-80"))
console.log("h/px:", cn("h-8 px-2.5", "h-9 px-4"))
console.log(
  "bg:",
  cn(
    "bg-primary text-primary-foreground hover:bg-primary/80",
    "bg-indigo-500 text-white hover:bg-indigo-600"
  )
)
console.log("rounded:", cn("rounded-lg", "rounded-xl"))
console.log("gap:", cn("gap-4", "gap-6"))
console.log("size:", cn("size-8", "size-10"))
console.log("text:", cn("text-sm", "text-base"))
