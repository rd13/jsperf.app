import Head from 'next/head'

import Layout from '../../components/Layout'
import Link from 'next/link'
import { pagesCollection } from '../../lib/mongodb'
import {datetimeLong} from '../../utils/Date'

export default function User(props) {
  const {published, unpublished} = props

  return (
    <>
      <Head>
        <title>jsPerf.app</title>
      </Head>
      <Layout>
        <ul>
          { published.map(({slug, revision, title, published, revisionCount, tests}, index) => {
              return (
                <li key={index}>
                  <Link href={`/${slug}/${revision}`}>
                    <a>{title}</a>
                  </Link>
                  <span> Published on <time dateTime={published}>
                    {datetimeLong(published)}
                  </time></span>
                  <span> [{tests.length} tests, {revisionCount} revision{`${revisionCount > 1 ? 's' : ''}`}]</span>
                </li>
              )
          }) }
        </ul>
      </Layout>
    </>
  )
}

export const getStaticProps = async ({params}) => {
  const {id} = params
  let pageData = []

  try {
    const pages = await pagesCollection()

    pageData = await pages.aggregate([
      {
        $match: { githubID: id, visible: true }
      },
      {
        $project: {
          title: 1, slug: 1, revision: 1, published: 1, visible: 1, githubID: 1, tests: 1
        }
      },
      { 
        $group : { 
          _id : "$slug",
          revisionCount: { 
            $sum: 1 
          },
          document: {
            "$first": "$$ROOT"
          }
        }
      },
      {
        "$replaceRoot":{
          "newRoot": {
            $mergeObjects: [
              "$document",
              { revisionCount: "$revisionCount"}
            ]
          }
        }
      },
      {
        $sort: {
          published: -1
        }
      },
    ]).toArray()
  } catch (e) {
  }

  const published = pageData.filter(p => p.visible)

  return {
    props: {
      published: JSON.parse(JSON.stringify(published))
    }
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  };
}
