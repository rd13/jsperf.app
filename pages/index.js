import Layout from '../components/Layout'
import { signIn, useSession } from "next-auth/react"
import GitHubIcon from '../components/GitHubIcon'
import buttonStyles from '../styles/buttons.module.css'
import EditForm from '../components/forms/Edit'
import Link from 'next/link'

export default function Home(props) {
  const { data: session, status } = useSession()

  return (
    <Layout>
      <h1>jsPerf.app — Online JavaScript performance playground &amp; jsperf.com mirror</h1>
      <div>
        <p>
          This is a complete rewrite in homage to the once excellent jsperf.com now with hopefully a more modern &amp; maintainable <a href="https://github.com/rd13/jsperf.app">codebase</a>.
        </p>

        <p>
          <i>Most</i> jsperf.com URLs are mirrored at the same path, e.g:
        </p>

        <pre>https://jsperf.com/js-template-engines-performance/32</pre>

        <p>Can be accessed at:</p>

        <pre>
          <Link href="/js-template-engines-performance/32">
            <a>https://jsperf.app/js-template-engines-performance/32</a>
          </Link>
        </pre>
      </div>

      <h2>Create a test case</h2>

      { session &&
          <EditForm />
      }

      { !session &&
          <button className={buttonStyles.default} onClick={() => signIn("github")}>
            <GitHubIcon fill="#000000" width={32} height={32} /><span>Login with GitHub to Create Test Cases</span>
          </button>
      }
    </Layout>
  )
}
