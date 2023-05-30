import { type LinksFunction, type LoaderFunction } from "@remix-run/node"
import { useLoaderData, useRouteError } from "@remix-run/react"
import { Bookmark } from "@prisma/client"

import { db, JsonifyModel } from "~/utils/db.server"
import { badRequest, notFound } from "~/utils/http-response"
import { timeAgo } from "~/utils/date"
import { getUserId } from "~/utils/session.server"
import { ErrorDisplay } from "~/utils/errors"

import stylesUrl from "~/styles/view.css"

export let links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: stylesUrl
  }
]

type LoaderData =
  | {
      bookmark: JsonifyModel<
        Pick<Bookmark, "id" | "url" | "title" | "description" | "createdAt">
      >
    }
  | undefined

export let loader: LoaderFunction = async ({ request, params }) => {
  let userId = await getUserId(request)

  if (!params.id) {
    throw badRequest({ code: "missing_id", message: "Id is missing" })
  }

  let id = parseInt(params.id, 10)
  if (Number.isNaN(id)) {
    throw badRequest({ code: "invalid_id", message: "Id is invalid" })
  }

  let bookmark = await db.bookmark.findFirst({
    where: {
      id,
      // If logged in, show private bookmarks, otherwise exclude them
      private: userId ? undefined : false
    },
    select: {
      id: true,
      url: true,
      title: true,
      description: true,
      createdAt: true
    }
  })

  if (!bookmark) {
    throw notFound({
      code: "bookmark_not_found",
      message: "Bookmark not found"
    })
  }

  return { bookmark }
}

export function meta({ data }: { data: LoaderData }) {
  if (!data) {
    return [{ title: "Bookmark not found | Bookmarks" }]
  }

  let { bookmark } = data

  return [
    { title: `${bookmark.title || bookmark.url} | Bookmarks` },
    { description: bookmark.description }
  ]
}

export default function BookmarkView() {
  let loaderData = useLoaderData<LoaderData>()
  if (!loaderData) return

  let { title, url, description, createdAt } = loaderData.bookmark

  return (
    <main>
      <h2>
        <a href={url}>{title || url}</a>
      </h2>

      <p className="view__description">{description}</p>
      <time dateTime={createdAt} className="view__created-at">
        {timeAgo(createdAt)}
      </time>
    </main>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  return <ErrorDisplay error={error} />
}
