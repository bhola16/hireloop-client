import Link from "next/link"
import { MapPin, PlusIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "cn"

const trending = ["Product Designer", "AI Engineering", "Dev-ops Engineer"]

const sparkles = [
  { type: "dot", size: "size-1", className: "top-[70%] left-[12%] bg-indigo-300/40" },
  { type: "dot", size: "size-1.5", className: "top-[84%] left-[6%] bg-indigo-400/30" },
  { type: "dot", size: "size-1", className: "top-[58%] right-[14%] bg-indigo-300/50" },
  { type: "dot", size: "size-1.5", className: "top-[76%] right-[8%] bg-indigo-400/25" },
  { type: "dot", size: "size-1", className: "top-[90%] left-[30%] bg-indigo-300/35" },
  { type: "dot", size: "size-1", className: "top-[66%] left-[22%] bg-indigo-200/20" },
  { type: "plus", size: "size-3.5", className: "top-[54%] left-[16%] text-indigo-200/25" },
  { type: "plus", size: "size-3.5", className: "top-[86%] right-[19%] text-indigo-200/20" },
  { type: "plus", size: "size-3", className: "top-[92%] left-[45%] text-indigo-200/15" },
]

function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-14 pb-20 sm:pt-20 sm:pb-28">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 0%, color-mix(in oklab, var(--foreground) 4%, transparent), transparent 70%)",
        }}
      />

      {/* Decorative sparkles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {sparkles.map((sparkle, index) => (
          <span
            key={index}
            className={cn(
              "absolute",
              sparkle.size,
              sparkle.type === "dot"
                ? "rounded-full"
                : "text-current",
              sparkle.className
            )}
          >
            {sparkle.type === "plus" && "+"}
          </span>
        ))}
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Announcement badge */}
        <div className="relative mx-auto w-fit">
          <span
            aria-hidden="true"
            className="absolute top-1/2 right-full h-px w-16 -translate-y-1/2 bg-gradient-to-l from-border/80 to-transparent sm:w-24"
          />
          <span
            aria-hidden="true"
            className="absolute top-1/2 left-full h-px w-16 -translate-y-1/2 bg-gradient-to-r from-border/80 to-transparent sm:w-24"
          />
          <p className="flex items-center gap-3 rounded-full border border-border/70 bg-card/40 py-2 pr-5 pl-3.5 backdrop-blur-xs">
            <span aria-hidden="true">🧳</span>
            <span className="font-mono text-sm font-semibold tracking-wider text-foreground">
              50,000+
            </span>
            <span className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">
              New jobs this month
            </span>
          </p>
        </div>

        {/* Headline */}
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          Find Your Dream Job Today
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base text-balance text-muted-foreground sm:text-lg">
          HireLoop connects top talent with world-class companies. Browse
          thousands of curated opportunities and land your next role — faster.
        </p>

        {/* Search bar */}
        <form
          action="/jobs"
          className="mx-auto mt-8 flex max-w-2xl items-center gap-1 rounded-2xl border border-border/70 bg-card/40 p-2 backdrop-blur-xs sm:mt-10"
        >
          <label className="flex min-w-0 flex-1 items-center gap-2.5 px-2 sm:px-3">
            <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
            <input
              name="q"
              placeholder="Job title, skill or company"
              className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>

          <Separator orientation="vertical" className="hidden h-8 sm:block" />

          <label className="hidden min-w-0 flex-1 items-center gap-2.5 px-3 sm:flex">
            <MapPin className="size-4 shrink-0 text-muted-foreground" />
            <input
              name="location"
              placeholder="Location or Remote"
              className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>

          <Button
            type="submit"
            aria-label="Search jobs"
            size="icon-lg"
            className="size-11 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600"
          >
            <SearchIcon />
          </Button>
        </form>

        {/* Trending positions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          <span className="text-sm text-muted-foreground">
            Trending Position
          </span>
          {trending.map((position) => (
            <Link
              key={position}
              href={`/jobs?q=${encodeURIComponent(position)}`}
              className="rounded-full border border-border px-4 py-1.5 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
            >
              {position}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export { Hero }
