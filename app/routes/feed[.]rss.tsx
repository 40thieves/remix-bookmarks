import type { LoaderFunction } from "remix"
import { db } from "~/utils/db.server"

function escapeCdata(s: string) {
  return s.replace(/\]\]>/g, "]]]]><![CDATA[>")
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export const loader: LoaderFunction = async ({ request }) => {
  let bookmarks = await db.bookmark.findMany({
    take: 100,
    orderBy: { createdAt: "desc" }
  })

  let host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host")
  if (!host) {
    throw new Error("Could not determine domain URL.")
  }
  let protocol = host.includes("localhost") ? "http" : "https"
  let domain = `${protocol}://${host}`
  let bookmarksUrl = `${domain}/jokes`

  const rssString = `
    <rss xmlns:blogChannel="${bookmarksUrl}" version="2.0">
      <channel>
        <title>Bookmarks</title>
        <link>${bookmarksUrl}</link>
        <description>A collection of useful links curated by Ali Smith</description>
        <language>en-us</language>
        <ttl>40</ttl>
        ${bookmarks
          .map(({ id, title, url, description, createdAt }) =>
            `
            <item>
              <title><![CDATA[${escapeCdata(title || url)}]]></title>
              <description><![CDATA[${escapeHtml(
                description || title || url
              )}]]></description>
              <author>Ali Smith</author>
              <pubDate>${createdAt.toUTCString()}</pubDate>
              <link>${bookmarksUrl}/${id}</link>
              <guid>${bookmarksUrl}/${id}</guid>
            </item>
          `.trim()
          )
          .join("\n")}
      </channel>
    </rss>
  `.trim()

  return new Response(rssString, {
    headers: {
      "Cache-Control": `public, max-age=${60 * 10}, s-maxage=${60 * 60 * 24}`,
      "Content-Type": "application/xml",
      "Content-Length": String(Buffer.byteLength(rssString))
    }
  })
}
