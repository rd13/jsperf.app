import { pagesCollection } from '../../../lib/mongodb'
import EditForm from '../../../components/forms/Edit'
import Layout from '../../../components/Layout'

export default function Edit({pageData}) {

  return (
    <Layout>
      <EditForm pageData={pageData} />
    </Layout>
  )
}

export async function getStaticProps({params}) {
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
    },
    revalidate: 60
  }
}

export async function getStaticPaths() {
  const pages = await pagesCollection()

  const pagesQuery = await pages.find({}, {
    projection: { slug: 1, revision: 1, _id: 0 }
  }).toArray()

  const paths = pagesQuery.map(page => {
    return {
      params: {
        /**
         * /test-case/3/edit
         */
        slug: page.slug,
        revision: `${page.revision}`
      }
    }
  })

  return {
    paths,
    fallback: 'blocking'
  };
}
