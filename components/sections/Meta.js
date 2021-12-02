import { datetimeLong } from '../../utils/Date'
import { useSession } from "next-auth/react"
import { useState } from 'react'
import { useRouter } from 'next/router'
import styles from './Meta.module.css'

const Meta = (props) => {
  const {slug, revision, authorName, published, githubID} = props.pageData

  const [visible, setVisible] = useState(props.pageData?.visible)

  const { data: session, status } = useSession()

  const isOwner = session?.user?.id === githubID

  const publish = async () => {
    const response = await fetch('/api/tests', {
      method: 'PUT',
      body: JSON.stringify({
        slug, revision,
        visible: true
      }),
    })

    const json = await response.json()

    if (json.success) {
      setVisible(true)
    }
  }

  const { asPath } = useRouter()

  return (
    <>
      {revision > 1
          ? <span>Revision {revision} of this benchmark created </span>
          : <span>Benchmark created </span>
      }
      { authorName && <span> by {authorName} </span>}
      on <time dateTime={published} pubdate="true">{datetimeLong(published)}</time>
      { isOwner && visible &&
          <span>Published</span>
      }
      { isOwner && !visible &&
          <button onClick={publish} className={styles.unpublishedLink}>Not published yet!</button> 
      }
      {
        isOwner &&
          <a href={`${asPath}/edit`}>Edit</a>
      }
    </>
  )
}

export default Meta
