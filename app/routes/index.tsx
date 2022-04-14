import { Link, ThrownResponse, useCatch, useLoaderData } from "remix"
import type { LoaderFunction, LinksFunction } from "remix"
import { Bookmark } from "@prisma/client"

import { db, JsonifyModel } from "~/utils/db.server"
import { badRequest } from "~/utils/http-response"

import stylesUrl from "~/styles/list.css"
import { daysAgo } from "~/utils/date"

export let links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: stylesUrl
  }
]

type LoaderData = {
  bookmarks: JsonifyModel<
    Pick<Bookmark, "id" | "url" | "title" | "description" | "createdAt">
  >[]
  pagination: {
    current: number
    hasPrevious: boolean
    previous: number
    hasNext: boolean
    next: number
  }
}

const PER_PAGE = 20

export let loader: LoaderFunction = async ({ request }) => {
  let searchParams = new URL(request.url).searchParams
  let page = parseInt(searchParams.get("page") || "1", 10)

  if (Number.isNaN(page) || page < 1) {
    throw badRequest({ error: "invalid_page" })
  }

  // Offset is zero-indexed page number multiplied by the number of bookmarks per page
  let skip = (page - 1) * PER_PAGE

  let [bookmarks, totalCount] = await db.$transaction([
    db.bookmark.findMany({
      select: {
        id: true,
        url: true,
        title: true,
        description: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: PER_PAGE
    }),
    db.bookmark.count()
  ])

  return {
    bookmarks,
    pagination: {
      current: page,
      // If we're on the first page, there is no previous page
      hasPrevious: page - 1 > 0,
      previous: page - 1,
      // If the next offset is beyond the total count, there is no next page
      hasNext: skip + PER_PAGE <= totalCount,
      next: page + 1
    }
  }
}

export default function Index() {
  let { bookmarks, pagination } = useLoaderData<LoaderData>()

  return (
    <main className="list__container">
      {bookmarks.map(({ id, url, title, description, createdAt }) => {
        return (
          <div key={id} className="list__item">
            <a href={url}>{title || url}</a>
            <p className="list__description">
              {description || <small>No description</small>}
            </p>
            <Link to={String(id)} className="list__created-at">
              {daysAgo(createdAt)}
            </Link>
          </div>
        )
      })}
      <div className="pagination__container">
        {pagination.hasPrevious && (
          <Link to={`.?page=${pagination.previous}`}>Previous</Link>
        )}
        {pagination.hasNext && (
          <Link to={`.?page=${pagination.next}`}>Next</Link>
        )}
      </div>
    </main>
  )
}

type CaughtError = ThrownResponse & {
  error?: string
}

export function CatchBoundary() {
  let caught = useCatch<CaughtError>()

  let message
  switch (caught.status) {
    case 400:
      if (caught.data.error === "invalid_page") {
        message = <p>Oops! That's not a valid page number.</p>
      } else {
        message = <p>Oops! Looks like you sent some bad data in a request.</p>
      }
      break
    default:
      throw new Error(caught.data || caught.statusText)
  }

  return (
    <main>
      <h2>
        {caught.status}: {caught.statusText}
      </h2>
      {message}
    </main>
  )
}
