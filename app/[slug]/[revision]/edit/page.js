import { notFound } from "next/navigation"
import { pagesCollection } from '@/app/lib/mongodb'
import EditForm from '@/components/EditForm'
import Layout from '@/components/Layout'

export const getPageData = async (params) => {
  const { slug, revision } = params

  const pages = await pagesCollection()

  const pageData = await pages.findOne({
    slug, revision: parseInt(revision) || 1
  }, {projection: { _id: 0 }})

  if (!pageData) {
    return notFound()
  }

  return {
    pageData: JSON.parse(JSON.stringify(pageData))
  }
}

export default async function Edit({ params }) {
  const { pageData } = await getPageData(params)

  return (
    <>
      <Layout>
        <div className="py-2"></div>
        <EditForm pageData={pageData} />
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
