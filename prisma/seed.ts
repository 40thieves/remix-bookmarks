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
      url: "https://alasdairsmith.co.uk",
      title: "Alasdair Smith | 40thieves",
      description: "My website"
    },
    {
      url: "https://example.com",
      title: "Example Domain",
      description: "Example website"
    },
    {
      url: "https://remix.run",
      title: "Remix - Build Better Websites",
      description: "Remix homepage"
    },
    {
      url: "https://piccalil.li/quick-tip/use-css-clamp-to-create-a-more-flexible-wrapper-utility",
      title:
        "Use CSS Clamp to create a more flexible wrapper utility - Quick Tip - Piccalilli",
      description:
        "Tip to use the CSS clamp function to make text wrap more nicely in responsive designs"
    }
  ]
}
