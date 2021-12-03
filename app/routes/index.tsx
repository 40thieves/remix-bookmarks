import { useLoaderData } from "remix"
import type { LoaderFunction } from "remix"

import { db } from "~/utils/db.server"

type LoaderData = {
  bookmarks: {
    url: string
    description: string
  }[]
}

export let loader: LoaderFunction = async () => {
  let bookmarks = await db.bookmark.findMany({
    select: {
      url: true,
      description: true
    }
  })
  return { bookmarks }
}

export default function Index() {
  const { bookmarks } = useLoaderData<LoaderData>()

  return (
    <article>
      {bookmarks.map(({ url, description }) => {
        return (
          <div>
            <a href={url}>{url}</a>
            <p>{description}</p>
          </div>
        )
      })}
    </article>
  )
}
