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
      <h2 className="font-semibold py-5">Create a test case</h2>
      <EditForm />
    </Layout>
    </>
  )
}
