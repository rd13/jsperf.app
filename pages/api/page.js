import { pagesCollection } from '../../lib/mongodb'
import { getSession } from "next-auth/react"
import { shortcode } from "../../utils/Url"

/**
 *
 * Function to ensure we are using a slug that doesn't already exist
 *
 */
const generateSlugId = async (length = 6, attempts = 10) => {
  const pages = await pagesCollection()

  return new Promise((resolve, reject) => {
    const testSlug = (async (attempt = 0) => {

      if (attempt >= attempts) {
        reject(new Error('Too many attempts'))
        return
      }

      const slug = shortcode(length + attempt)
      
      const result = await pages.findOne({
        slug
      }, (err, result) => {
        if (err) {
          reject(err)
        } else if (result) {
          testSlug(attempt++)
        } else {
          resolve(slug)
        }
      })
    })()
  })
}

const revalidatePath = async (baseUrl, path) => {
  const response = await fetch(baseUrl + '/api/revalidate?' + new URLSearchParams({
    secret: process.env.REVALIDATE_SECRET,
    path
  }))

  const {revalidated} = await response.json()

  return revalidated
}

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
      throw new Error('User is not authenticated.')
    }

    const pages = await pagesCollection()

    const payload = JSON.parse(req.body)
    
    // Could be a revision of an existing page.
    // In which case use the same slug.
    let slug = payload.slug
    if (!slug) {
      slug = await generateSlugId()
      payload.slug = slug
      console.log('NEW SLUG: ', slug)
    }

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
        // If the slug exists then the revision number is an increment of the
        // last revision, otherwise 1.
        payload.revision = doc ? doc.revision + 1 : 1
      })

    payload.published = new Date()

    // Set the github user ID
    session.user?.id && (payload.githubID = session.user.id)

    // Do the insert
    // Will throw an error if schema validation fails
    await pages.insertOne(payload)
      .then(({ops}) => {
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

    // Only the original owner of this page can update it
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
    }).then(async () => {

      // Invalidate cache
      // We need to specify absolute URL because node/server/fetch
      const protocol = req.headers['x-forwarded-proto'] || 'http'
      const baseUrl = req ? `${protocol}://${req.headers.host}` : ''

      const revalidated = await revalidatePath(baseUrl, `/${slug}/${revision}`)

      if (revalidated) {
        res.json({
          message: 'Updated page successfully',
          success: true,
          data: { slug, revision },
        })
      } else {
        throw new Error('Could not invalidate path')
      }
    })

  } catch (error) {
    return res.json({
      message: new Error(error).message,
      success: false,
    })
  }
}

export default (req, res) => {
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
