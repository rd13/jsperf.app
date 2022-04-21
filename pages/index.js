import Layout from '../components/Layout'
import { signIn, useSession } from "next-auth/react"
import { useRouter } from 'next/router'
import GitHubIcon from '../components/GitHubIcon'
import buttonStyles from '../styles/buttons.module.css'
import EditForm from '../components/forms/Edit'
import Link from 'next/link'

export default function Home(props) {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (router.query.debug) {
    return (
      <Layout>
        <h1 className="py-5 text-xl"><span className="text-2xl font-bold">jsPerf.app</span> — Online JavaScript performance playground &amp; jsperf.com mirror</h1>
        <div>
          <p>
            This is a complete rewrite in homage to the once excellent jsperf.com now with hopefully a more modern &amp; maintainable <a href="https://github.com/rd13/jsperf.app">codebase</a>.
          </p>

          <p className="my-4">
            <i>Most</i> jsperf.com URLs are mirrored at the same path, e.g:
          </p>

          <pre>https://jsperf.com/js-template-engines-performance/32</pre>

          <p className="my-4">Can be accessed at:</p>

          <pre>
            <Link href="/js-template-engines-performance/32">
              <a>https://jsperf.app/js-template-engines-performance/32</a>
            </Link>
          </pre>
        </div>

        <h2 className="font-semibold py-5">Create a test case</h2>

        { session &&
            <EditForm />
        }

        { !session &&
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-darkest font-bold py-2 px-4 rounded inline-flex items-center border border-gray-400" onClick={() => signIn("github")}>
              <GitHubIcon fill="#000000" width={32} height={32} className="mr-2" />
              <span>Login with GitHub to Create Test Cases</span>
            </button>
        }
      </Layout>
    )
  } else {
    return null
  }
}
