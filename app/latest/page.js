import Link from 'next/link'
import { pagesCollection } from '@/app/lib/mongodb'
import Layout from '@/components/Layout'
import {datetimeLong} from '../../utils/Date'

export const revalidate = 60 * 60 // 1 hour

const getStaticProps = async () => {
  const pages = await pagesCollection()

  const entries = await pages.aggregate([
    { 
      $match : {
        visible: true,
        published: { $gt: new Date("2016-01-01T00:00:00Z") }
      }
    },
    {
      $project: {
        title: 1, slug: 1, revision: 1, published: 1, testsCount: { $size: "$tests" }
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
    {
      $limit: 500
    }
  ],
    {
      allowDiskUse: true
    }
  ).toArray();

  return {
    entries: JSON.parse(JSON.stringify(entries))
  }
}

export default async function Latest() {
  const { entries } = await getStaticProps()

  return (
    <Layout>
        <h2 className="font-bold my-5">Latest</h2>
        <ul>
          {entries.map(({title, slug, revision, testsCount, published, revisionCount}, index) => {
              return (
                <li key={index}>
                  <Link href={revision === 1 ? `/${slug}` : `/${slug}/${revision}`}>
                    {title}
                  </Link>
                  <span> Published on <time dateTime={published}>
                    {datetimeLong(published)}
                  </time></span>
                  <span> [{testsCount} tests, {revisionCount} revision{`${revisionCount > 1 ? 's' : ''}`}]</span>
                </li>
              )
            }
          )}
        </ul>
    </Layout>
  )
}

export const metadata = {
  title: 'jsPerf - Latest Benchmarks',
  description: 'Browse the latest online javascript performance benchmarks',
}
