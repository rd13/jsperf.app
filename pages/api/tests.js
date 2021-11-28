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
  const session = await getSession({ req })

  try {
    const pages = await pagesCollection()

    const payload = JSON.parse(req.body)

    const {slug, revision} = payload

    // Get the page we wish to update
    const page = await pages.findOne(
      { slug, revision },
      {
        projection: {
          revision: 1,
          githubID: 1,
          _id: 1
        }
      })

    if (!page) {
      throw new Error('Trying to update a page that does not exist.')
    }

    if (page.githubID !== session?.user?.id) {
      throw new Error('Does not have the authority to update this page.')
    }

    // Ensure we don't allow these fields to be updated
    delete payload._id
    delete payload.slug
    delete payload.revision
    delete payload.githubID

    await pages.updateOne({
      '_id': page._id
    }, {
      $set: {
        ...payload
      }
    }).then(obj => {
      res.json({
        message: 'Updated page successfully',
        success: true
      })
    })

  } catch (error) {
    return res.json({
      message: new Error(error).message,
      success: false,
    });
  }
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
