import { pagesCollection } from '../../../../lib/mongodb'

import TestRunner from '@/components/TestRunner'
import Layout from '@/components/Layout'
import Meta from '@/components/sections/Meta'
import Info from '@/components/sections/Info'
import Setup from '@/components/sections/Setup'
import Teardown from '@/components/sections/Teardown'
import PrepCode from '@/components/sections/PrepCode'
import PublishButton from '@/components/Buttons/PublishButton'

const getPageData = async (params) => {
  const { slug, revision } = params

  const pages = await pagesCollection()

  const pageData = await pages.findOne({
    slug, revision: parseInt(revision) || 1
  })

  if (!pageData) {
    return {
      notFound: true
    }
  }

  return { 
    pageData: JSON.parse(JSON.stringify(pageData))
  }
}

export default async function Preview({ params }) {
  const { pageData } = await getPageData(params)

  const { 
    authorName, 
    info, 
    initHTML, 
    published, 
    setup, 
    slug, 
    revision,
    teardown, 
    tests,
    title, 
    uuid,
    visible,
    githubID,
  } = pageData

  return (
    <>
      <Layout>
        <hgroup>
          <h1 className="text-2xl py-6 font-bold">{title}</h1>
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
          </section>
        }
        {setup &&
          <section>
            <Setup setup={setup} />
          </section>
        }
        {teardown &&
          <section>
            <Teardown teardown={teardown} />
          </section>
        }
        <section>
          <TestRunner tests={tests} initHTML={initHTML} setup={setup} teardown={teardown} />
        </section>
        <hr className="my-5" />
        <div className="flex justify-end">
          { !visible &&
              <PublishButton 
                slug={slug} 
                revision={revision} 
                uuid={uuid} 
                githubID={githubID}
            />
          }
        </div>
      </Layout>
    </>
  )
}

export const metadata = {
  robots: {
    index: false,
    follow: true
  },
}
