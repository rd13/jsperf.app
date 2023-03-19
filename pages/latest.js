import Link from 'next/link'
import Head from 'next/head'
import { pagesCollection } from '../lib/mongodb'
import Layout from '../components/Layout'
import {datetimeLong} from '../utils/Date'

export default function Latest(props) {
  const {entries} = props
  return (
    <>
      <Head>
        <title>jsPerf - Latest Benchmarks</title>
        <meta
          name="description"
          content="Browse the latest online javascript performance benchmarks"
          key="desc"
        />
      </Head>
      <Layout>
        <h2 className="font-bold my-5">Latest</h2>
          <ul>
            {entries.map(({title, slug, revision, testsCount, published, revisionCount}, index) => {
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
              }
            )}
          </ul>
      </Layout>
    </>
  )
}

export const getStaticProps = async () => {

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
    props: { 
      entries: JSON.parse(JSON.stringify(entries))
    },
    revalidate: 60 * 60 // 1 hour in seconds
  }
}
