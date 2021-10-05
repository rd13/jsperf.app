import Head from 'next/head'
import { pagesCollection } from '../lib/mongodb'
import Layout from '../components/Layout'
import Link from 'next/link'

const LinkWithLinkText = (props) => {
  console.log(props)
  return (
    <a>https://jsperf.app{props.href}</a>
  )
}

export default function Home(props) {
  const {slug, revision} = props.random
  const randomHref = `/${slug}` + (revision > 1 ? `/${revision}` : ``)
  return (
    <Layout>
      <h1>jsPerf.app — JavaScript performance sandbox</h1>
      <p>This is a complete rewrite in homage to the once excellent jsperf.com with proper code sandboxing and hopefully a more modern maintainable codebase.</p>

      <p>Most jsperf.com URLs / tests are mirrored at the same path, e.g:</p>

      <pre>https://jsperf.com{randomHref}</pre>

      <p>Can be accessed at:</p>

      <pre>
        <Link href={randomHref}>
          <a>https://jsperf.app{randomHref}</a>
        </Link>
      </pre>

      <h2>Create a test case</h2>
      <button>Login with GitHub to Create Test Cases</button>
    </Layout>
  )
}

export async function getStaticProps(context) {
  const pages = await pagesCollection()

  // Get a random slug/revision to link in the site description
  const random = await pages.aggregate([
    { $sample: { size: 1 } },
    { $project: {slug: 1, revision: 1, _id: 0} }
  ]).toArray()

  return {
    props: { 
      random: random.pop()
    },
    revalidate: 60
  }
}
