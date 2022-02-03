import { pagesCollection } from '../../../lib/mongodb'

import TestRunner from '../../../components/TestRunner'

import Layout from '../../../components/Layout'

import Meta from '../../../components/sections/Meta'
import Info from '../../../components/sections/Info'
import Setup from '../../../components/sections/Setup'
import Teardown from '../../../components/sections/Teardown'
import PrepCode from '../../../components/sections/PrepCode'

export default function Preview(props) {
  const { 
    _id, 
    authorName, 
    info, 
    initHTML, 
    published, 
    revision, 
    setup, 
    slug, 
    teardown, 
    tests,
    title, 
  } = props.pageData

  return (
    <Layout>
      <hgroup>
        <h1 className="text-2xl py-10 font-bold">{title}</h1>
      </hgroup>
      <section>
        <Meta pageData={props.pageData} />
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
        <TestRunner id={_id} tests={tests} />
      </section>
      <hr className="my-5" />
    </Layout>
  )
}

export async function getServerSideProps({params}) {
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
    props: { 
      pageData: JSON.parse(JSON.stringify(pageData))
    }
  }
}
