import { cache } from 'react'
import { redirect, notFound } from "next/navigation"
import { pagesCollection } from '@/app/lib/mongodb'
import TestRunner from '@/components/TestRunner'

import Layout from '@/components/Layout'

import Meta from '@/components/sections/Meta'
import Revisions from '@/components/sections/Revisions'
import Info from '@/components/sections/Info'
import Setup from '@/components/sections/Setup'
import Teardown from '@/components/sections/Teardown'
import PrepCode from '@/components/sections/PrepCode'
import { SoftwareSourceCode } from '@/components/StructuredData'

export const revalidate = 60 * 60 * 24 // 1 day

const getPageData = cache(async (slug, revision) => {
  const pages = await pagesCollection()

  const pageData = await pages.findOne({
    slug, revision: parseInt(revision) || 1
  })

  const revisions = await pages.find({
    slug, visible: true
  }, {projection: {slug: 1, revision: 1, authorName: 1, published: 1} }).sort({revision: 1}).toArray()

  if (!pageData || !pageData.visible) {
    return notFound()
  }

  return { 
    pageData: JSON.parse(JSON.stringify(pageData)),
    revisions: JSON.parse(JSON.stringify(revisions))
  }
})

export async function generateMetadata({ params }) {
  const [ slug, revision ] = params.slug

  const { pageData } = await getPageData(slug, revision)

  const { 
    title, 
    mirror,
  } = pageData

  return {
    title: `${title}${revision > 1 ? ` (v${revision})` : ''}`,
    description: `${title}${revision > 1 ? ` (v${revision})` : ''} - Online Javascript Benchmark${mirror ? ' - jsPerf.com mirror' : ''}`
  }
}

export default async function Slug({ params }) {
  const [ slug, revision ] = params.slug

  /**
   * Redirect revision 1 so we don't have a duplicate URL
   */
  if (revision === '1') {
    redirect(`/${slug}`)
  }

  const { pageData, revisions } = await getPageData(slug, revision)

  const { 
    _id, 
    authorName, 
    info, 
    initHTML, 
    published, 
    setup, 
    teardown, 
    tests,
    title, 
    mirror,
  } = pageData

  return (
    <>
      <Layout>
        <div itemScope itemType="http://schema.org/SoftwareSourceCode">
          <hgroup>
            <h1 itemProp="name" className="text-2xl py-6 font-bold">{title}<span className="text-gray-400 text-base">{`${revision > 1 ? ` (v${revision})` : ''}`}</span></h1>
          </hgroup>
          <section>
            <Meta pageData={pageData} />
          </section>
          <hr className="my-5" />
          {info &&
            <section>
              <Info info={info} />
            </section>
          }
          {initHTML &&
            <section>
              <PrepCode prepCode={initHTML} />
              <SoftwareSourceCode 
                name={`${title} Javascript Benchmark HTML Setup`} 
                text={setup} 
                programmingLanguage="HTML"
                version={revision}
              />
            </section>
          }
          {setup &&
            <section>
              <Setup setup={setup} />
              <SoftwareSourceCode 
                name={`${title} Javascript Benchmark Setup Script`} 
                text={setup} 
                version={revision}
              />
            </section>
          }
          {teardown &&
            <section>
              <Teardown teardown={teardown} />
            </section>
          }
          <section>
            <TestRunner id={_id} tests={tests} initHTML={initHTML} setup={setup} teardown={teardown} />
          </section>
          <hr className="my-5" />
          <section>
            <Revisions revisions={revisions} slug={slug} revision={revision || 1} />
          </section>
        </div>
      </Layout>
    </>
  )
}
