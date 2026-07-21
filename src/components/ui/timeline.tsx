import * as React from "react"
import { cn } from "@/lib/utils"

const Timeline = React.forwardRef<HTMLOListElement, React.HTMLAttributes<HTMLOListElement>>(({ className, ...props }, ref) => (
  <ol ref={ref} className={cn("relative border-s border-border ml-3", className)} {...props} />
))
Timeline.displayName = "Timeline"

const TimelineItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("mb-6 ms-6", className)} {...props} />
))
TimelineItem.displayName = "TimelineItem"

const TimelineIcon = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "absolute flex items-center justify-center w-6 h-6 bg-background rounded-full -start-3 ring-8 ring-background border border-border",
      className
    )}
    {...props}
  />
))
TimelineIcon.displayName = "TimelineIcon"

const TimelineContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-1", className)} {...props} />
))
TimelineContent.displayName = "TimelineContent"

const TimelineTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("flex items-center text-sm font-semibold text-foreground", className)} {...props} />
))
TimelineTitle.displayName = "TimelineTitle"

const TimelineDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm font-normal text-muted-foreground", className)} {...props} />
))
TimelineDescription.displayName = "TimelineDescription"

const TimelineTime = React.forwardRef<HTMLTimeElement, React.HTMLAttributes<HTMLTimeElement>>(({ className, ...props }, ref) => (
  <time ref={ref} className={cn("text-xs font-normal leading-none text-muted-foreground mb-1", className)} {...props} />
))
TimelineTime.displayName = "TimelineTime"

export { Timeline, TimelineItem, TimelineIcon, TimelineContent, TimelineTitle, TimelineDescription, TimelineTime }
