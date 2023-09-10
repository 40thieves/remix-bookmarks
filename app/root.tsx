import { LinksFunction, LoaderFunction } from "@remix-run/node"

import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError
} from "@remix-run/react"

import { getUserId } from "~/utils/session.server"

import globalStylesUrl from "~/styles/global.css"
import { ErrorDisplay, getStatusText } from "./utils/errors"

export function meta() {
  return [
    { title: "Bookmarks" },
    { description: "A collection of useful links curated by Ali Smith" }
  ]
}

export let links: LinksFunction = () => [
  { rel: "icon", href: "favicon.svg" },
  { rel: "stylesheet", href: "https://unpkg.com/open-props" },
  {
    rel: "stylesheet",
    href: "https://unpkg.com/open-props/normalize.min.css"
  },
  { rel: "stylesheet", href: globalStylesUrl }
]

type LoaderData = {
  userId: number | null
}

export let loader: LoaderFunction = async ({ request }) => {
  let userId = await getUserId(request)

  return { userId }
}

export default function App() {
  let loaderData = useLoaderData<LoaderData>()

  return (
    <Document>
      <Layout userId={loaderData?.userId}>
        <Outlet />
      </Layout>
    </Document>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  console.log(error)

  if (isRouteErrorResponse(error)) {
    let statusText = getStatusText(error)

    return (
      <Document title={`Error: ${statusText} | Bookmarks`}>
        <div className="main__container">
          <ErrorDisplay error={error} />
        </div>
      </Document>
    )
  }

  return (
    <Document title="Error | Bookmarks">
      <div className="main__container">
        <ErrorDisplay error={error} />
      </div>
    </Document>
  )
}

function Document({
  children,
  title
}: {
  children: React.ReactNode
  title?: string
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  )
}

function Layout({
  children,
  userId
}: {
  children: React.ReactNode
  userId?: number | null
}) {
  return (
    <>
      <header className="header__container">
        <h1>
          <Link to="/" prefetch="intent">
            Bookmarks
          </Link>
        </h1>

        <nav aria-label="Main navigation" className="header__nav">
          {userId ? (
            <>
              <Link to="new" prefetch="intent">
                Create new&hellip;
              </Link>
              <LogoutForm />
            </>
          ) : (
            <Link to="login" prefetch="intent">
              Log in
            </Link>
          )}
        </nav>
      </header>

      <div className="main__container">{children}</div>

      <footer className="footer__container">
        <span className="footer__copyright">&copy; Alasdair Smith</span>
      </footer>
    </>
  )
}

function LogoutForm() {
  return (
    <form action="/logout" method="post">
      <button type="submit" className="btn-link">
        Log out
      </button>
    </form>
  )
}
