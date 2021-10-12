import {pagesCollection} from '../../lib/mongodb'

export default async function handler(req, res) {
    // switch the methods
    switch (req.method) {
        case 'GET': {
            return getPosts(req, res);
        }

        case 'POST': {
            return addPost(req, res);
        }

        case 'PUT': {
            return updatePost(req, res);
        }

        case 'DELETE': {
            return deletePost(req, res);
        }
    }
}

// Adding a new post
async function addPost(req, res) {
  const schema = {
    required: ['title', 'slug'],
    properties: {
      title: { bsonType: 'string' },
      slug: { bsonType: 'string' }
    }
  }
    try {
        const pages = await pagesCollection();
        await pages.insertOne(JSON.parse(req.body));

        return res.json({
            message: 'Post added successfully',
            success: true,
        });
    } catch (error) {
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}
