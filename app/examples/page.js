import Link from 'next/link'
import { pagesCollection, examplesCollection } from '@/app/lib/mongodb'
import Layout from '@/components/Layout'
import { datetimeLong } from '@/utils/Date'
import { marked } from 'marked'
import { highlightSanitizedMarkdown } from '@/utils/hljs'

export const revalidate = 60 * 60 // 1 hour

const getStaticProps = async () => {
  const pagesC = await pagesCollection()
  const examplesC = await examplesCollection()

  const examplesMap = await examplesC.aggregate([
    {
      $project: {
        _id: 0, slug: 1, revision: 1
      }
    },
    {
      $limit: 100
    }
  ]).toArray()

  if (!examplesMap.length) {
    return {
      entries: []
    }
  }

  const entries = await pagesC.aggregate([
    { 
      $match : {
        $and: [
          {
            $or: examplesMap
          },
          { visible: true }
        ]
      }
    },
    {
      $project: {
        title: 1, info: 1, slug: 1, revision: 1, published: 1, testsCount: { $size: "$tests" }
      }
    },
    {
      $limit: 100
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

export default async function Examples() {
  const { entries } = await getStaticProps()

  return (
    <Layout>
        <article>
          <h1 className="font-bold text-2xl my-3">Example Benchmarks</h1>
          <hr className="mb-2" />
          
          {entries.map(({title, info, slug, revision, testsCount, published, revisionCount}, index) => {
              return (
                <article key={index} className="py-4">
                  <Link href={revision === 1 ? `/${slug}` : `/${slug}/${revision}`} className="font-bold">
                    {title}
                  </Link>
                  <div className="markdown" dangerouslySetInnerHTML={{__html: highlightSanitizedMarkdown(marked(info))}}></div>
                </article>
              )
            }
          )}
        </article>
    </Layout>
  )
}

export const metadata = {
  title: 'jsPerf - Example Benchmarks',
  description: 'Browse example online javascript performance benchmarks',
}
