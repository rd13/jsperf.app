import {pagesCollection} from '../../lib/mongodb'
import { getSession } from "next-auth/react"

// Adding a new post
const addPost = async (req, res) => {
  const session = await getSession({ req })

  try {
    const pages = await pagesCollection()

    const payload = JSON.parse(req.body)

    const {slug} = payload

    // Get the most recent revision for this slug
    const lastInsert = await pages.findOne(
      { slug },
      {
        sort: {
          revision: -1
        },
        projection: {
          revision: 1
        }
      })

    // Set this insert revision as an increment of the previous, or default 1
    payload.revision = lastInsert ? lastInsert.revision + 1 : 1

    payload.published = new Date()

    // Associate tests with github user
    session?.user?.id && (payload.githubID = session.user.id)

    await pages.insertOne(payload)

    return res.json({
      message: 'Post added successfully',
      created: { slug: payload.slug, revision: payload.revision },
      success: true,
    });
  } catch (error) {
    return res.json({
      message: new Error(error).message,
      success: false,
    });
  }
}

const updatePost = async (req, res) => {
  console.log('update post')

}

const handler = async (req, res) => {
  switch (req.method) {
    case 'POST': {
      return addPost(req, res);
    }

    case 'PUT': {
      return updatePost(req, res);
    }
  }
}

export default handler
