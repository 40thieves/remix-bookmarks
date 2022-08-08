import { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node"
import { Form, Link, useLoaderData } from "@remix-run/react"

import { preventAnonAccess, requireUserId } from "~/utils/session.server"

import stylesUrl from "~/styles/import.css"
import { badRequest } from "~/utils/http-response"
import { timeAgo } from "~/utils/date"
import { db } from "~/utils/db.server"

export let links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: stylesUrl
  }
]

const PER_PAGE = 20
const TOTAL_PINBOARD_BOOKMARKS = 3812 // Hard coded number of Pinboard bookmarks

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

type PinboardBookmark = {
  hash: string
  href: string
  description: string
  extended: string
  time: string
}

export default function Import() {
  let { bookmarks, pagination } = useLoaderData()

  return (
    <main className="import__container">
      <Form method="post" className="import__form">
        {bookmarks.map(
          ({ hash, href, description, time }: PinboardBookmark) => {
            return (
              <div key={hash} className="import__item">
                <input
                  type="checkbox"
                  className="import__checkbox"
                  name="foo"
                  value={hash}
                />
                <div className="import__info">
                  {/* <label htmlFor={}"> */}
                  <a href={href} className="import__link">
                    {description || href}
                  </a>
                  {/* </label> */}
                  <p className="import__description">
                    {description || <small>No description</small>}
                  </p>
                  <span className="import__created-at">{timeAgo(time)}</span>
                </div>
              </div>
            )
          }
        )}
        <button type="submit" className="import__button">
          Import selected
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
