import Link from 'next/link'
import { pagesCollection } from '@/app/lib/mongodb'
import Layout from '@/components/Layout'
import { datetimeLong } from '@/utils/Date'
import { marked } from 'marked'
import { highlightSanitizedMarkdown } from '@/utils/hljs'

export const revalidate = 60 * 60 // 1 hour

const pageMapDev = [
  { slug: 'torago', revision: 1 },
  { slug: 'bosute', revision: 1 },
  { slug: 'zoqake', revision: 1 },
]

const pageMapProd = [
  { slug: 'negative-modulo', revision: 142 }, // prototype
  { slug: 'yiwuwi', revision: 1 }, // embedded <script>
  {}
  // mobule import underscore flatten
  // async example
]

const getStaticProps = async () => {
  const pages = await pagesCollection()

  const entries = await pages.aggregate([
    { 
      $match : {
        $and: [
          {
            $or: process.env.NODE_ENV === 'production' ? pageMapProd : pageMapDev
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

export default async function Latest() {
  const { entries } = await getStaticProps()

  return (
    <Layout>
        <article>
          <h1 className="font-bold text-4xl my-5">Example Benchmarks</h1>
          <hr className="mb-6" />
          
          {entries.map(({title, info, slug, revision, testsCount, published, revisionCount}, index) => {
              return (
                <article key={index} className="lg:px-8 py-4">
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
  title: 'jsPerf - Example Online Javascript Performance Benchmarks',
  description: 'Browse the latest online javascript performance benchmarks',
}
