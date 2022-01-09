import {
  Link,
  Links,
  LiveReload,
  Meta,
  MetaFunction,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch
} from "remix"
import type { LinksFunction } from "remix"

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

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)
  return (
    <Document title="Error!">
      <Layout>
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
          <p>
            Hey, developer, you should replace this with what you want your
            users to see.
          </p>
        </div>
      </Layout>
    </Document>
  )
}

export function CatchBoundary() {
  let caught = useCatch()

  let message
  switch (caught.status) {
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

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
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

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="header__container">
        <Link to="/">
          <h1>Bookmarks</h1>
        </Link>

        <nav aria-label="Main navigation" className="header__nav">
          <Link to="https://alasdairsmith.co.uk">Homepage</Link>
          <Link to="https://40thiev.es">Blog</Link>
        </nav>
      </header>

      <div className="main__container">{children}</div>

      <footer className="footer__container">
        <span className="footer__copyright">&copy; Alasdair Smith</span>
      </footer>
    </>
  )
}
