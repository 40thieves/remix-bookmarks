import type { LinksFunction, LoaderFunction } from "@remix-run/node"
import { Link, useLoaderData, useRouteError } from "@remix-run/react"
import { Bookmark } from "@prisma/client"

import { db, JsonifyModel } from "~/utils/db.server"
import { badRequest } from "~/utils/http-response"

import { timeAgo } from "~/utils/date"
import { getUserId } from "~/utils/session.server"
import { ErrorDisplay } from "~/utils/errors"

import stylesUrl from "~/styles/list.css"

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
  let userId = await getUserId(request)

  let searchParams = new URL(request.url).searchParams
  let page = parseInt(searchParams.get("page") || "1", 10)

  if (Number.isNaN(page) || page < 1) {
    throw badRequest({ code: "invalid_page", message: "Invalid page number" })
  }

  // Offset is zero-indexed page number multiplied by the number of bookmarks per page
  let skip = (page - 1) * PER_PAGE

  let [bookmarks, totalCount] = await db.$transaction([
    db.bookmark.findMany({
      where: {
        // If logged in, show private bookmarks, otherwise exclude them
        private: userId ? undefined : false
      },
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
      <h1>Bookmarks</h1>
      {bookmarks.map(({ id, url, title, description, createdAt }) => {
        return (
          <div key={id} className="list__item">
            <a href={url}>{title || url}</a>
            <p className="list__description">
              {description || <small>No description</small>}
            </p>
            <Link
              to={String(id)}
              className="list__created-at"
              prefetch="intent"
            >
              {timeAgo(createdAt)}
            </Link>
          </div>
        )
      })}
      <div className="pagination__container">
        {pagination.hasPrevious && (
          <Link to={`.?page=${pagination.previous}`} prefetch="intent">
            Previous
          </Link>
        )}
        {pagination.hasNext && (
          <Link to={`.?page=${pagination.next}`} prefetch="intent">
            Next
          </Link>
        )}
      </div>
    </main>
  )
}

export function ErrorBoundary() {
  let error = useRouteError()
  return <ErrorDisplay error={error} />
}
