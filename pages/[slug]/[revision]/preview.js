import { pagesCollection } from '../../../lib/mongodb'
import Router from 'next/router'
import { signIn, useSession } from "next-auth/react"

import TestRunner from '../../../components/TestRunner'

import Layout from '../../../components/Layout'

import Meta from '../../../components/sections/Meta'
import Info from '../../../components/sections/Info'
import Setup from '../../../components/sections/Setup'
import Teardown from '../../../components/sections/Teardown'
import PrepCode from '../../../components/sections/PrepCode'
import GitHubIcon from '../../../components/GitHubIcon'
import buttonStyles from '../../../styles/buttons.module.css'
import styles from '../../../components/sections/Meta.module.css'
import UUID from '../../../components/UUID'

export default function Preview(props) {
  const { data: session, status } = useSession()
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
  const canPublish = !visible && (!!session && session?.user?.id === githubID || !!session && uuid === userID)
  const canEdit = !!session && session?.user?.id === githubID || uuid === userID

  console.log('publish', canPublish, 'edit', canEdit)

  const publish = async (event) => {
    event.preventDefault();
    const response = await fetch('/api/page', {
      method: 'PUT',
      body: JSON.stringify({
        slug, revision, uuid,
        visible: true
      }),
    })

    const r = await response.json()
    console.log(r)

    if (r.success) {
      Router.push(`/${slug}/${revision}`)
    }
  }

  return (
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
        <TestRunner id={_id} tests={tests} />
      </section>
      <hr className="my-5" />
      <div className="flex justify-end">
        { canEdit &&
            <>
              <a href={`/${slug}/${revision}/edit`} className={buttonStyles.default}>Edit Tests</a><span className="inline-flex items-center px-2"> - or - </span>
            </>
        }
        { !session &&
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-darkest font-bold py-1 px-2 rounded inline-flex items-center border border-gray-400" type="button" onClick={() => signIn("github")}>
              <GitHubIcon fill="#000000" width={32} height={32} className="mr-2" />
              <span>Login with GitHub to Publish</span>
            </button>
        }
        { canPublish &&
            <a onClick={publish} href="#" className={styles.unpublishedButton}>Publish</a> 
        }
      </div>
    </Layout>
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
