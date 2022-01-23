import {
  Link,
  Links,
  LiveReload,
  LoaderFunction,
  LinksFunction,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData
} from "remix"
import { User } from "@prisma/client"

import { getUserId } from "./utils/session.server"

import globalStylesUrl from "~/styles/global.css"

export let meta: MetaFunction = () => ({
  title: "Bookmarks",
  description: "A collection of useful links curated by Ali Smith"
})

export let links: LinksFunction = () => [
  { rel: "stylesheet", href: "https://unpkg.com/open-props" },
  {
    rel: "stylesheet",
    href: "https://unpkg.com/open-props/normalize.min.css"
  },
  { rel: "stylesheet", href: globalStylesUrl }
]

type LoaderData = {
  user: User | null
}

export let loader: LoaderFunction = async ({ request }) => {
  let user = await getUserId(request)

  return { user }
}

export default function App() {
  let loaderData = useLoaderData<LoaderData>()

  return (
    <Document>
      <Layout user={loaderData?.user}>
        <Outlet />
      </Layout>
    </Document>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)

  return (
    <Document title="Error!">
      {/* Note: we don't render Document here, as it requires user data */}
      <div className="main__container">
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
        </div>
      </div>
    </Document>
  )
}

export function CatchBoundary() {
  let caught = useCatch()

  let message
  switch (caught.status) {
    case 400:
      message = <p>Oops! Looks like you sent some bad data in a request.</p>
      break
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      )
      break
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      )
      break

    default:
      throw new Error(caught.data || caught.statusText)
  }

  let loaderData = useLoaderData<LoaderData>()

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout user={loaderData?.user}>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
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
  user
}: {
  children: React.ReactNode
  user?: User | null
}) {
  return (
    <>
      <header className="header__container">
        <Link to="/">
          <h1>Bookmarks</h1>
        </Link>

        <nav aria-label="Main navigation" className="header__nav">
          {user ? (
            <>
              <Link to="new">Create new&hellip;</Link>
              <LogoutForm />
            </>
          ) : (
            <Link to="login">Log in</Link>
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
