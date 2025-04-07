import Link from 'next/link'
import { pagesCollection } from '@/app/lib/mongodb'
import Layout from '@/components/Layout'
import { datetimeLong } from '@/utils/Date'

export const revalidate = 60 * 60 // 1 hour

const pageMapDev = [
  { slug: 'kipuyi', revision: 9 },
  { slug: 'zoqake', revision: 1 },
  { slug: 'desihe', revision: 7 },
]

const pageMapProd = [
  { slug: 'kipuyi', revision: 9 },
  { slug: 'zoqake', revision: 1 },
  { slug: 'desihe', revision: 7 },
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
          <h2 className="font-bold my-5">Example jsPerf Benchmark Tests</h2>
          {entries.map(({title, info, slug, revision, testsCount, published, revisionCount}, index) => {
              return (
                <article key={index} className="lg:px-8 py-4 sm:py-12">
                  <Link href={revision === 1 ? `/${slug}` : `/${slug}/${revision}`} className="text-lg font-bold">
                    {title}
                  </Link>
                  <p>{info}</p>
                </article>
              )
            }
          )}
        </article>
    </Layout>
  )
}

export const metadata = {
  title: 'jsPerf - Latest Benchmarks',
  description: 'Browse the latest online javascript performance benchmarks',
}
