import Router from 'next/router'
import { datetimeLong } from '../../utils/Date'
import { useSession } from "next-auth/react"
import { useState } from 'react'
import styles from './Meta.module.css'

const Meta = (props) => {
  const {slug, revision, authorName, published, githubID} = props.pageData

  const [visible, setVisible] = useState(props.pageData?.visible)

  const { data: session, status } = useSession()

  const isOwner = session?.user?.id === githubID

  const publish = async (event) => {
    event.preventDefault();
    const response = await fetch('/api/page', {
      method: 'PUT',
      body: JSON.stringify({
        slug, revision,
        visible: true
      }),
    })

    const {success} = await response.json()

    if (success) {
      // setVisible(true)
      Router.push(`/${slug}/${revision}`)
    }
  }

  return (
    <h2 className="text-xl">
      {revision > 1
          ? <span>Revision {revision} of this benchmark created </span>
          : <span>Benchmark created </span>
      }
      { authorName && <span> by {authorName} </span>}
      on <time dateTime={published} pubdate="true">{datetimeLong(published)}</time>
      { isOwner && !visible &&
          <>
            <a onClick={publish} href="#" className={styles.unpublishedButton}>Not published yet!</a> 
            <span> - </span><a href={`/${slug}/${revision}/edit`}>Edit</a>
          </>
      }
    </h2>
  )
}

export default Meta
