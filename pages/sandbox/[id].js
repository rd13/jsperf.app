import { pagesCollection } from '../../lib/mongodb'
import { ObjectId } from 'mongodb'
import dynamic from 'next/dynamic'
import Script from 'next/script'
import { useState, useEffect } from 'react'
import UI from '../../components/Benchmark'

export default function Sandbox(props) {
  const [ready, setReady] = useState(false);

  const {pageData} = props

  useEffect(async () => {
    setReady(true)
  }, []);

  return (
    <UI pageData={pageData} />
  )
}

export const getStaticProps = async ({params}) => {
  const {id} = params
  let pageData

  try {
    const _id = ObjectId(id)

    const pages = await pagesCollection()

    pageData = await pages.findOne(_id)
  } catch (e) {
  }

  if (!pageData) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      pageData: JSON.parse(JSON.stringify(pageData)) // wtf bro
    }
  }
}

export async function getStaticPaths() {
  const pages = await pagesCollection()

  const pagesQuery = await pages.find({}, {
    projection: { _id: 1 }
  }).toArray()

  const paths = pagesQuery.map(page => {
    const id = page._id.toString()
    return {
      params: {
        id
      }
    }
  })

  return {
    paths,
    fallback: 'blocking'
  };
}
