import Link from 'next/link'
import { pagesCollection } from '../lib/mongodb'
import Layout from '../components/Layout'

export default function Latest(props) {
  const {entries} = props
  return (
    <Layout>
      <h1 className="py-5 text-xl">Latest</h1>
        <ul>
          {entries.map(({title, slug, revision, tests, revisionCount}, index) => {
              return (
                <li key={index}>
                  <Link href={`/${slug}/${revision}`}>
                    <a>{title}</a>
                  </Link>
                  <span> {tests.length} tests, {revisionCount} revision{`${revisionCount > 1 ? 's' : ''}`}</span>
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

  const entries = await pages.aggregate(
    { 
      $match : {visible: true}
    },
    {
      $project: {
        title: 1, slug: 1, revision: 1, published: 1, tests: 1
      }
    },
    {
      $sort: {
        published: -1
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
      $limit: 100
    }
  ).toArray();

  return { 
    props: { 
      entries: JSON.parse(JSON.stringify(entries))
    },
    revalidate: 60 * 60 // 1 hour in seconds
  }
}
