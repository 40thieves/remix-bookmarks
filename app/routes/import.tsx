import {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
  redirect
} from "@remix-run/node"
import {
  Form,
  Link,
  useLoaderData,
  useSearchParams,
  useTransition
} from "@remix-run/react"

import { preventAnonAccess } from "~/utils/session.server"

import stylesUrl from "~/styles/import.css"
import { badRequest } from "~/utils/http-response"
import { timeAgo } from "~/utils/date"
import { db } from "~/utils/db.server"
import { useState } from "react"

export let links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: stylesUrl
  }
]

const PER_PAGE = 20
const TOTAL_PINBOARD_BOOKMARKS = 3812 // Hard coded total number of Pinboard bookmarks

export let loader: LoaderFunction = async ({ request }) => {
  await preventAnonAccess(request)

  let searchParams = new URL(request.url).searchParams
  let page = parseInt(searchParams.get("page") || "1", 10)

  if (Number.isNaN(page) || page < 1) {
    throw badRequest({ error: "invalid_page" })
  }

  let skip = (page - 1) * PER_PAGE

  let qs = new URLSearchParams({
    auth_token: process.env.PINBOARD_AUTH_TOKEN as string,
    format: "json",
    start: skip.toString(),
    results: PER_PAGE.toString()
  })

  let res = await fetch(`https://api.pinboard.in/v1/posts/all/?${qs}`)
  let bookmarks = await res.json()

  return {
    bookmarks,
    pagination: {
      current: page,
      // If we're on the first page, there is no previous page
      hasPrevious: page - 1 > 0,
      previous: page - 1,
      // If the next offset is beyond the total count, there is no next page
      hasNext: skip + PER_PAGE <= TOTAL_PINBOARD_BOOKMARKS, // Hard coded n
      next: page + 1
    }
  }
}

export let action: ActionFunction = async ({ request }) => {
  await preventAnonAccess(request)

  // TODO: validation?

  let formData = await request.formData()

  // Dirty hack to join import data by the hash id that is stored in the key
  type ByHashObj = { [key: string]: { [key: string]: string } }
  let importsByHash = Array.from(formData.entries()).reduce<ByHashObj>(
    (acc, [key, value]) => {
      if (!key.includes(":")) return acc

      let [hashId, prop] = key.split(":")

      if (!acc[hashId]) {
        acc[hashId] = {}
      }

      acc[hashId][prop] = value.toString()

      return acc
    },
    {}
  )

  // Strip hash id as it is not needed
  let importData = Object.values(importsByHash)

  let imports = importData.map((data) => ({
    url: data.href,
    title: data.description,
    description: data.extended,
    private: data.shared === "no" ? true : false,
    createdAt: data.time,
    updatedAt: data.time
  }))

  await db.bookmark.createMany({
    data: imports
  })

  // Redirect back to the same page
  let page = formData.get("page") || 1
  let qs = new URLSearchParams({ page: page.toString() }).toString()
  return redirect(`/import?${qs}`)
}

type PinboardBookmark = {
  hash: string
  href: string
  description: string
  extended: string
  shared: "yes" | "no"
  time: string
}

export default function Import() {
  let { bookmarks, pagination } = useLoaderData()
  let [searchParams] = useSearchParams()
  let transition = useTransition()

  return (
    <main className="import__container">
      <Form method="post" className="import__form">
        {bookmarks.map((bookmark: PinboardBookmark) => {
          return <ImportRow bookmark={bookmark} key={bookmark.hash} />
        })}
        <input
          type="hidden"
          name="page"
          value={searchParams.get("page") || 1}
        />
        <button
          type="submit"
          className="import__button"
          disabled={!!transition.submission}
        >
          {transition.submission ? "Importing..." : "Import selected bookmarks"}
        </button>
      </Form>
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

function ImportRow({ bookmark }: { bookmark: PinboardBookmark }) {
  let { hash, href, description, extended, shared, time } = bookmark

  let [checked, setChecked] = useState(false)

  return (
    <div className="import__item">
      <input
        type="checkbox"
        className="import__checkbox"
        checked={checked}
        onChange={() => setChecked((c) => !c)}
      />
      {checked ? (
        <>
          <input type="hidden" name={`${hash}:href`} value={href} />
          <input
            type="hidden"
            name={`${hash}:description`}
            value={description}
          />
          <input type="hidden" name={`${hash}:extended`} value={extended} />
          <input type="hidden" name={`${hash}:shared`} value={shared} />
          <input type="hidden" name={`${hash}:time`} value={time} />
        </>
      ) : null}
      <div className="import__info">
        <a href={href} className="import__link">
          {description || href}
        </a>
        <p>{description || <small>No description</small>}</p>
        <p>🔒 {shared === "no" ? "true" : "false"}</p>
        <span className="import__created-at">{timeAgo(time)}</span>
      </div>
    </div>
  )
}
