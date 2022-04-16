import { Temporal } from "@js-temporal/polyfill"

const relativeTimeFormat = new Intl.RelativeTimeFormat("en", {
  numeric: "auto"
})

export function timeAgo(timestamp: string) {
  let time = Temporal.Instant.from(timestamp)
  let duration = durationSinceNow(time)

  // For large durations, relative time is harder to read. So instead, just
  // format as absolute time instead
  if (duration.years || duration.months > 6) {
    return time.toLocaleString("en", {
      year: "numeric",
      month: "long"
    })
  } else if (duration.days) {
    // Currently we can't use toLocaleString() for durations as it requires
    // Intl.DurationFormat. Seems like this isn't included in the polyfill
    return relativeTimeFormat.format(duration.days, "days")
  } else if (duration.hours) {
    return relativeTimeFormat.format(duration.hours, "hours")
  } else {
    return relativeTimeFormat.format(duration.minutes, "minutes")
  }
}

function durationSinceNow(time: Temporal.Instant) {
  return (
    time
      .since(Temporal.Now.instant())
      // "Round" the duration to get the largest unit of time. E.g. convert 90
      // minutes into 1 hour, 30 minutes. We want the largest unit when
      // displaying as "time ago".
      // I honestly have no idea why we need to round twice. But to get it to
      // round years nicely, this seems to be required.
      .round({ largestUnit: "days", smallestUnit: "minutes" })
      .round({
        smallestUnit: "minute",
        largestUnit: "year",
        // When using largestUnit of years, a relative time is required. This is
        // because the length of years can change (e.g. leap years). See:
        // https://tc39.es/proposal-temporal/docs/balancing.html for more info.
        relativeTo: time.toString()
      })
  )
}
