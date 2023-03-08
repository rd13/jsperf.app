import Link from 'next/link'
import { pagesCollection } from '../lib/mongodb'
import Layout from '../components/Layout'
import {datetimeLong} from '../utils/Date'

export default function Latest(props) {
  const {entries} = props
  return (
    <Layout>
      <h2 className="font-bold my-5">Latest</h2>
        <ul>
          {entries.map(({title, slug, revision, tests, published, revisionCount}, index) => {
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
            }
          )}
        </ul>
    </Layout>
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
        title: 1, slug: 1, revision: 1, published: 1, tests: 1
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
