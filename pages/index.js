import Head from 'next/head'

import Layout from '../components/Layout'
import EditForm from '../components/forms/Edit'

export default function Home(props) {
  return (
    <>
    <Head>
      <title>jsPerf - Online JavaScript performance benchmark - jsPerf.com mirror</title>
      <meta
        name="description"
        content="jsPerf.app is an online JavaScript performance benchmark test runner and jsperf.com mirror"
        key="desc"
      />
      <link href="https://jsperf.app" rel="canonical" />
    </Head>
    <Layout navState={{ about: true }}>
      <h1 className="font-semibold py-2">Create a test case</h1>
      <EditForm />
    </Layout>
    </>
  )
}
