import Layout from '@/components/Layout'
import EditForm from '@/components/forms/Edit'

export default function Home(props) {
  return (
    <>
    <Layout navState={{ about: true }}>
      <h1 className="font-semibold py-2">Create a test case</h1>
      <EditForm />
    </Layout>
    </>
  )
}

export const metadata = {
  title: 'jsPerf - Online JavaScript performance benchmark - jsPerf.com mirror',
  description: 'jsPerf.app is an online JavaScript performance benchmark test runner and jsperf.com mirror',
  alternates: {
    canonical: 'https://jsperf.app'
  }
}
