import {pagesCollection} from '../../lib/mongodb'
import { getSession } from "next-auth/react"

/**
 * Adds a new page.
 *
 * A page includes a page title, slug, and an array of tests.
 *
 * @param {} req The request object.
 * @param {} res The response object.
 */
const addPage = async (req, res) => {
  try {
    const session = await getSession({ req })

    if (!session) {
      throw new Error('User session required')
    }

    const pages = await pagesCollection()

    const payload = JSON.parse(req.body)

    const {slug} = payload

    // Get the most recent revision for this slug
    await pages.findOne(
      { slug },
      {
        sort: {
          revision: -1
        },
        projection: {
          revision: 1
        }
      }).then(doc => {
        // Set this insert revision as an increment of the previous, or default 1
        payload.revision = doc ? doc.revision + 1 : 1
      })

    payload.published = new Date()

    // Associate tests with github user
    session?.user?.id && (payload.githubID = session.user.id)

    await pages.insertOne(payload).then(({ops}) => {
      // http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#%7EinsertOneWriteOpResult
      const [doc] = ops
      const {slug, revision} = doc
      res.json({
        message: 'Post added successfully',
        success: true,
        data: { slug, revision },
      })
    })
  } catch (error) {
    return res.json({
      message: new Error(error).message,
      success: false,
    })
  }
}

/**
 * Updates a page.
 *
 * @param {} req The request object.
 * @param {} res The response object.
 */
const updatePage = async (req, res) => {
  try {
    const session = await getSession({ req })

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
      throw new Error('Page does not exist.')
    }

    if (page.githubID !== session?.user?.id) {
      throw new Error('Does not have the authority to update this page.')
    }

    // Remove these fields from the update
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
    }).then(() => {
      res.json({
        message: 'Updated page successfully',
        success: true,
        data: { slug, revision },
      })
    })

  } catch (error) {
    return res.json({
      message: new Error(error).message,
      success: false,
    })
  }
}

export default function handler(req, res) {
  const { method } = req

  switch (method) {
    case 'POST':
      return addPage(req, res)
    case 'PUT':
      return updatePage(req, res)
    default:
      res.setHeader('Allow', ['POST', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
