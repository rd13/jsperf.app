import { pagesCollection } from '@/app/lib/mongodb'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"
import { shortcode } from "../../../utils/Url"

/**
 *
 * Function to ensure we are using a slug that doesn't already exist
 *
 */
const generateSlugId = async (attempts = 10) => {
  const pages = await pagesCollection()

  return new Promise(async (resolve, reject) => {
    let attempt = 0

    while (attempt <= attempts) {
      const slug = shortcode(6 + attempt)

      const page = await pages.findOne({
        slug
      }).catch(reject)

      // new slug found
      if (!page) {
        resolve(slug)
        break
      } 

      // reached max attempts
      if (attempt === attempts) {
        reject(new Error('Too many attempts at generating a new slug'))
        break
      }

      // slug exists, try again
      attempt++
    }
  })
}

/**
 * Adds a new page.
 *
 * A page includes a page title, slug, and an array of tests.
 *
 * @param {} req The request object.
 * @param {} res The response object.
 */
export async function POST(req, res) {
  try {
    const session = await getServerSession(authOptions)

    const pages = await pagesCollection()

    const payload = await req.json()

    // Could be a revision of an existing page.
    // In which case use the same slug.
    let slug = payload.slug
    if (!slug) {
      slug = await generateSlugId()
      payload.slug = slug
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

    // Set the github user ID if authenticated
    if (session?.user?.id) {
      payload.githubID = session.user.id
    }

    // Will throw an error if schema validation fails
    const { acknowledged, insertedId } = await pages.insertOne(payload)

    if (acknowledged && insertedId) {
      return Response.json({
        message: 'Post added successfully',
        success: true,
        data: { slug: payload.slug, revision: payload.revision },
      })
    } else {
      throw new Error('Mongo couldn\'t insertOne')
    }

  } catch (error) {
    return Response.json({
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
export async function PUT(req, res) {
  try {
    const session = await getServerSession(authOptions)

    const pages = await pagesCollection()

    const payload = await req.json()

    const {slug, revision, uuid} = payload

    // Get the page we wish to update
    const page = await pages.findOne(
      { slug, revision },
      {
        projection: {
          revision: 1,
          githubID: 1,
          uuid: 1,
          _id: 1
        }
      })

    if (!page) {
      throw new Error('Page does not exist.')
    }

    if (page.mirror) {
      throw new Error('Protect imported perfs')
    }

    // Only the original creator of this page can update it
    let allowedToEdit = false

    if (page.githubID && session?.user?.id) {
      if (page.githubID === session?.user?.id) {
        allowedToEdit = true
      }
    }

    if (page.uuid === uuid) {
      allowedToEdit = true
    }

    if (!allowedToEdit) {
      throw new Error('Does not have the authority to update this page.')
    }

    // Remove these fields from the update
    delete payload._id
    delete payload.slug
    delete payload.revision
    delete payload.githubID

    if (session?.user?.id) {
      payload.githubID = session?.user?.id
    }

    const result = await pages.updateOne({
      '_id': page._id
    }, {
      $set: {
        ...payload
      }
    })

    // Invalidate cache
    // We need to specify absolute URL because node/server/fetch
    // const protocol = req.headers['x-forwarded-proto'] || 'http'
    // const baseUrl = req ? `${protocol}://${req.headers.host}` : ''

    return Response.json({
      message: 'Updated page successfully',
      success: true,
      data: { slug, revision },
    })

  } catch (error) {
    return Response.json({
      message: new Error(error).message,
      success: false,
    })
  }
}

// TODO: Respond 405 for methods that aren't allowed DELETE, GET, etc
