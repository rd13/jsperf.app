import Layout from '@/components/Layout'
import Link from 'next/link'
import { pagesCollection } from '../../../lib/mongodb'
import { datetimeLong } from '../../../utils/Date'

export const getPageData = async (id) => {
  let pageData = []

  try {
    const pages = await pagesCollection()

    pageData = await pages.aggregate([
      {
        $match: { githubID: id, visible: true }
      },
      {
        $project: {
          title: 1, slug: 1, revision: 1, published: 1, visible: 1, githubID: 1, testsCount: { $size: "$tests" }
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
    published: JSON.parse(JSON.stringify(published))
  }
}

export default async function User({ params }) {
  const { id } = params
  const { published, unpublished } = await getPageData(id)

  return (
    <>
      <Layout>
        <ul>
          { published.map(({slug, revision, title, published, revisionCount, testsCount}, index) => {
              return (
                <li key={index}>
                  <Link href={`/${slug}/${revision}`}>
                    {title}
                  </Link>
                  <span> Published on <time dateTime={published}>
                    {datetimeLong(published)}
                  </time></span>
                  <span> [{testsCount} tests, {revisionCount} revision{`${revisionCount > 1 ? 's' : ''}`}]</span>
                </li>
              )
          }) }
        </ul>
      </Layout>
    </>
  )
}

export const metadata = {
  title: 'jsPerf.app'
}
