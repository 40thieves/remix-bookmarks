import { PrismaClient } from "@prisma/client"
let db = new PrismaClient()

async function seed() {
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
      description: "My website"
    },
    {
      url: "https://example.com",
      description: "Example website"
    },
    {
      url: "https://remix.run",
      description: "Remix"
    }
  ]
}
