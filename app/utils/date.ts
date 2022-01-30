import { Temporal } from "@js-temporal/polyfill"

const relativeTimeFormat = new Intl.RelativeTimeFormat("en", {
  numeric: "auto"
})

export function daysAgo(timestamp: string) {
  let date = Temporal.Instant.from(timestamp)
  let duration = date
    .since(Temporal.Now.instant())
    .round({ largestUnit: "day", smallestUnit: "day" })

  return relativeTimeFormat.format(duration.days, "day")
}
