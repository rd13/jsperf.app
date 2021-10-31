import {pagesCollection} from '../../lib/mongodb'

// Adding a new post
const addPost = async (req, res) => {
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
