import Layout from '@/components/Layout'
import EditForm from '@/components/EditForm'

export default function Home(props) {
  return (
    <>
    <Layout navState={{ about: true }}>
      <div>
        <strong>Async tests</strong>
        <p>The async checkbox will provide a global function <code>deferred.resolve</code> which the test runner uses to determine that the test has finished.</p>
        <p>Example usage:</p>
        <pre>
{`
async function main() {
  //your code here
}

(async function start(){
  await main();
  deferred.resolve();
})()
`}
        </pre>
      </div>
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
