import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

const client = new MongoClient(uri)
const clientPromise = client.connect()

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

export const betterAuthDBClient = new MongoClient(process.env.BETTER_AUTH_MONGODB_URI)
