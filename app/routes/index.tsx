import { Link, useLoaderData } from "remix"
import type { LoaderFunction } from "remix"
import { Temporal } from "@js-temporal/polyfill"

import { db } from "~/utils/db.server"

const relativeTimeFormat = new Intl.RelativeTimeFormat("en", {
  numeric: "auto"
})

type LoaderData = {
  bookmarks: Array<{
    id: number
    url: string
    description: string
    createdAt: string // Not Date, since it is JSON-stringified
  }>
}

export let loader: LoaderFunction = async () => {
  let bookmarks = await db.bookmark.findMany({
    select: {
      id: true,
      url: true,
      description: true,
      createdAt: true
    }
  })
  return { bookmarks }
}

export default function Index() {
  const { bookmarks } = useLoaderData<LoaderData>()

  return (
    <article>
      {bookmarks.map(({ id, url, description, createdAt }) => {
        return (
          <div key={id}>
            <a href={url}>{url}</a>
            <p>{description}</p>
            <Link to={String(id)}>{daysAgo(createdAt)}</Link>
          </div>
        )
      })}
    </article>
  )
}

function daysAgo(timestamp: string) {
  let date = Temporal.Instant.from(timestamp)
  let duration = date
    .since(Temporal.Now.instant())
    .round({ largestUnit: "day", smallestUnit: "day" })

  return relativeTimeFormat.format(duration.days, "day")
}
