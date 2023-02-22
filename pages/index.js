import Head from 'next/head'

import Layout from '../components/Layout'
import { signIn, useSession } from "next-auth/react"
import GitHubIcon from '../components/GitHubIcon'
import buttonStyles from '../styles/buttons.module.css'
import EditForm from '../components/forms/Edit'
import Link from 'next/link'

export default function Home(props) {
  const { data: session, status } = useSession()

  return (
    <>
    <Head>
      <title>jsPerf - Online JavaScript performance benchmark - jsPerf.com mirror</title>
      <meta
        name="description"
        content="jsPerf.app is an online JavaScript performance benchmark test runner and jsperf.com mirror"
        key="desc"
      />
    </Head>
    <Layout>
      <h1 className="py-5 text-xl"><span className="text-2xl font-bold">jsPerf.app</span> — Online JavaScript performance benchmark test runner &amp; jsperf.com mirror</h1>
      <div>
        <p>
          This is a complete rewrite in homage to the once excellent jsperf.com now with hopefully a more modern &amp; maintainable <a href="https://github.com/rd13/jsperf.app">codebase</a>.
        </p>

        <p className="my-4">
          jsperf.com URLs are mirrored at the same path, e.g:
        </p>

        <pre>https://jsperf.com/negative-modulo/2</pre>

        <p className="my-4">Can be accessed at:</p>

        <pre>
          <Link href="/negative-modulo/2">
            <a>https://jsperf.app/negative-modulo/2</a>
          </Link>
        </pre>
      </div>

      <h2 className="font-semibold py-5">Create a test case</h2>
      <EditForm />
    </Layout>
    </>
  )
}
