import Head from 'next/head'

import { pagesCollection } from '../../../lib/mongodb'
import EditForm from '../../../components/forms/Edit'
import Layout from '../../../components/Layout'

export default function Edit({pageData}) {
  return (
    <>
      <Head>
        <meta 
          key="robots" 
          name="robots" 
          content="noindex,follow" 
        />
      </Head>
      <Layout>
        <div className="py-2"></div>
        <EditForm pageData={pageData} />
      </Layout>
    </>
  )
}

export const getServerSideProps = async ({params}) => {
  const { slug, revision } = params

  const pages = await pagesCollection()

  const pageData = await pages.findOne({
    slug, revision: parseInt(revision) || 1
  }, {projection: { _id: 0 }})

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
