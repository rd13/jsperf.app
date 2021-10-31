import Layout from '../components/Layout'
import { signIn, useSession } from "next-auth/react"
import GitHubIcon from '../components/GitHubIcon'
import buttonStyles from '../styles/buttons.module.css'
import EditForm from '../components/forms/Edit'

const LinkWithLinkText = (props) => {
  return (
    <a>https://jsperf.app{props.href}</a>
  )
}

export default function Home(props) {
  const { data: session, status } = useSession()
  console.log(session)

  return (
    <Layout>
      <h1>jsPerf.app — JavaScript performance sandbox &amp; jsperf.com mirror</h1>
      <p>This is a complete rewrite in homage to the once excellent jsperf.com now with proper code sandboxing and hopefully a more modern maintainable <a href="https://github.com/rd13/jsperf.app">codebase</a> whilst maintaining the familiar UI and asthetic.</p>

      <p><i>Most</i> jsperf.com URLs / tests are mirrored at the same path, e.g:</p>

      <pre>https://jsperf.com/js-template-engines-performance/32</pre>

      <p>Can be accessed at:</p>

      <pre>
        <a href="/js-template-engines-performance/32">https://jsperf.app/js-template-engines-performance/32</a>
      </pre>

      <h2>Create a test case</h2>

      { session &&
          <EditForm />
      }
      { !session &&
          <>
          <button className={buttonStyles.default} onClick={() => signIn("github")}><GitHubIcon fill="#000000" width={32} height={32} /><span>Login with GitHub to Create Test Cases</span></button>
          </>
      }
    </Layout>
  )
}

export async function getStaticProps(context) {
  return {
    props: { 
    }
  }
}
