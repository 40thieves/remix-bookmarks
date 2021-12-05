import { Link, useLoaderData } from "remix"
import type { LoaderFunction, LinksFunction } from "remix"
import { Temporal } from "@js-temporal/polyfill"

import { db } from "~/utils/db.server"
import stylesUrl from "~/styles/bookmarks.css"

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

export let links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: stylesUrl
    }
  ]
}

export let loader: LoaderFunction = async () => {
  let bookmarks = await db.bookmark.findMany({
    select: {
      id: true,
      url: true,
      description: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  })
  return { bookmarks }
}

export default function Index() {
  const { bookmarks } = useLoaderData<LoaderData>()

  return (
    <article className="bookmarks__list">
      {bookmarks.map(({ id, url, description, createdAt }) => {
        return (
          <div key={id} className="bookmark">
            <a href={url} className="bookmark__link">
              {url}
            </a>
            <p className="bookmark__description">{description}</p>
            <Link to={String(id)} className="bookmark__created-at">
              {daysAgo(createdAt)}
            </Link>
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
