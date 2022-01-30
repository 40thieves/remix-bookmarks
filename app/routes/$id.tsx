import { LinksFunction, LoaderFunction, useLoaderData } from "remix"
import { Bookmark } from "@prisma/client"

import { db, JsonifyModel } from "~/utils/db.server"
import { badRequest, notFound } from "~/utils/http-response"
import { daysAgo } from "~/utils/date"

import stylesUrl from "~/styles/view.css"

export let links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: stylesUrl
  }
]

type LoaderData = {
  bookmark: JsonifyModel<
    Pick<Bookmark, "id" | "url" | "title" | "description" | "createdAt">
  >
}

export let loader: LoaderFunction = async ({ params }) => {
  if (!params.id) throw badRequest({ error: "missing_id" })

  let id = parseInt(params.id, 10)
  if (Number.isNaN(id)) throw badRequest({ error: "invalid_id" })

  let bookmark = await db.bookmark.findUnique({
    where: { id },
    select: {
      id: true,
      url: true,
      title: true,
      description: true,
      createdAt: true
    }
  })

  if (!bookmark) throw notFound()

  return { bookmark }
}

export default function BookmarkView() {
  let { bookmark } = useLoaderData<LoaderData>()

  let { title, url, description, createdAt } = bookmark

  return (
    <main>
      <h2>
        <a href={url}>{title || url}</a>
      </h2>

      <p className="view__description">{description}</p>
      <time dateTime={createdAt} className="view__created-at">
        {daysAgo(createdAt)}
      </time>
    </main>
  )
}
