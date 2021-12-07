import { PrismaClient } from "@prisma/client"
let db = new PrismaClient()

async function seed() {
  await db.bookmark.deleteMany()

  await Promise.all(
    getBookmarks().map((bookmark) => {
      return db.bookmark.create({ data: bookmark })
    })
  )
}

seed()

function getBookmarks() {
  return [
    {
      url: "https://example.com",
      title: "Example Domain",
      description: "Example website",
      createdAt: new Date("1989-03-12T09:56:00Z"),
      updatedAt: new Date("1989-03-12T09:56:00Z")
    },
    {
      url: "https://alasdairsmith.co.uk",
      title: "Alasdair Smith | 40thieves",
      description: "My website",
      createdAt: new Date("2021-01-01T00:00:00Z"),
      updatedAt: new Date("2021-01-01T00:00:00Z")
    },
    {
      url: "https://piccalil.li/quick-tip/use-css-clamp-to-create-a-more-flexible-wrapper-utility",
      title:
        "Use CSS Clamp to create a more flexible wrapper utility - Quick Tip - Piccalilli",
      description:
        "Tip to use the CSS clamp function to make text wrap more nicely in responsive designs",
      createdAt: new Date("2021-03-16T21:45:00Z"),
      updatedAt: new Date("2021-03-16T21:45:00Z")
    },
    {
      url: "https://remix.run",
      title: "Remix - Build Better Websites",
      description: "Remix homepage",
      createdAt: new Date("2021-11-22T20:47:00Z"),
      updatedAt: new Date("2021-11-22T20:47:00Z")
    }
  ]
}
