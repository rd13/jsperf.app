import Head from 'next/head'

import { pagesCollection } from '../../lib/mongodb'
import { ObjectId } from 'mongodb'
import dynamic from 'next/dynamic'
import Script from 'next/script'
import { useState, useEffect } from 'react'
import UI from '../../components/UI'

export default function Sandbox(props) {
  const {pageData} = props

  return (
    <>
      <Head>
        <meta 
          key="robots" 
          name="robots" 
          content="noindex,follow" 
        />
      </Head>
      <UI pageData={pageData} />
    </>
  )
}

export async function getServerSideProps({params, res}) {
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

  res.setHeader('Cache-Control', 'no-store')

  return {
    props: {
      pageData: JSON.parse(JSON.stringify(pageData)) // wtf bro
    }
  }
}
