import Head from 'next/head'

import { pagesCollection } from '../../../lib/mongodb'
import { useRouter } from 'next/router'
import { signIn, useSession } from "next-auth/react"

import TestRunner from '../../../components/TestRunner'

import Layout from '../../../components/Layout'

import Meta from '../../../components/sections/Meta'
import Info from '../../../components/sections/Info'
import Setup from '../../../components/sections/Setup'
import Teardown from '../../../components/sections/Teardown'
import PrepCode from '../../../components/sections/PrepCode'
import buttonStyles from '../../../styles/buttons.module.css'
import styles from '../../../components/sections/Meta.module.css'
import UUID from '../../../components/UUID'

export default function Preview(props) {
  const { data: session, status } = useSession()
  const router = useRouter()

  const { 
    _id, 
    authorName, 
    info, 
    initHTML, 
    published, 
    revision, 
    setup, 
    slug, 
    teardown, 
    tests,
    title, 
    uuid,
    visible,
    githubID,
  } = props.pageData

  // TODO: 403 if no access
  const userID = UUID()

  // Can publish 
  let canEdit = false

  if (!visible) {
    if (githubID && session?.user?.id) {
      if (session?.user?.id === githubID) {
        canEdit = true
      }
    } 
    if (uuid === userID) {
      canEdit = true
    }
  }

  const publish = async (event) => {
    event.preventDefault();
    const response = await fetch('/api/page', {
      method: 'PUT',
      body: JSON.stringify({
        slug, revision, uuid,
        visible: true
      }),
    })

    const {success} = await response.json()

    if (success) {
      router.push(`/${slug}/${revision}`)
    }
  }

  return (
    <>
      <Head>
        <meta 
          key="robots" 
          name="robots" 
          content="noindex,follow" 
        />
      </Head>
      <Layout>
        <hgroup>
          <h1 className="text-2xl py-6 font-bold">{title}</h1>
        </hgroup>
        <section>
          <Meta pageData={props.pageData} />
        </section>
        <hr className="my-5" />
        {info &&
          <section>
            <Info info={info} />
          </section>
        }
        {initHTML &&
          <section>
            <PrepCode prepCode={initHTML} />
          </section>
        }
        {setup &&
          <section>
            <Setup setup={setup} />
          </section>
        }
        {teardown &&
          <section>
            <Teardown teardown={teardown} />
          </section>
        }
        <section>
          <TestRunner id={_id} tests={tests} initHTML={initHTML} setup={setup} teardown={teardown} />
        </section>
        <hr className="my-5" />
        <div className="flex justify-end">
          { canEdit &&
              <>
                <a href={`/${slug}/${revision}/edit`} className={buttonStyles.default}>Edit Tests</a><span className="inline-flex items-center px-2"> - or - </span>
                <a onClick={publish} href="#" className={styles.unpublishedButton}>Publish</a> 
              </>
          }
        </div>
      </Layout>
    </>
  )
}

export async function getServerSideProps({params}) {
  const { slug, revision } = params

  const pages = await pagesCollection()

  const pageData = await pages.findOne({
    slug, revision: parseInt(revision) || 1
  })

  if (!pageData) {
    return {
      notFound: true
    }
  }

  return { 
    props: { 
      pageData: JSON.parse(JSON.stringify(pageData))
    }
  }
}
