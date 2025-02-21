import Layout from '@/components/Layout'
import UI from '@/components/UI'

export default function Home(props) {
  return (
    <>
    <Layout navState={{ about: false }}>
      <br />
      <UI editable={true} />
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
