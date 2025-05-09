import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

let client
let clientPromise

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export const pagesCollection = async function() {
  const client = await clientPromise

  const db = client.db()

  return db.collection(process.env.MONGODB_COLLECTION)
}

export const examplesCollection = async function() {
  const client = await clientPromise

  const db = client.db()

  return db.collection(process.env.MONGODB_EXAMPLES_COLLECTION)
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise
