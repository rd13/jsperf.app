import { datetimeLong } from '../../utils/Date'
import { useSession } from "next-auth/react"

const Meta = (props) => {
  const {slug, revision, authorName, published, visible, githubID} = props.pageData

  const { data: session, status } = useSession()

  const isOwner = session && session.user.id === githubID

  const publish = async () => {
    const response = await fetch('/api/tests', {
      method: 'PUT',
      body: JSON.stringify({
        slug, revision,
        visible: true
      }),
    })

    const json  = await response.json()

    console.log(json)
  }

  return (
    <>
      {revision > 1
          ? <span>Revision {revision} of this benchmark created </span>
          : <span>Benchmark created </span>
      }
      { authorName && <span> by {authorName} </span>}
      on <time dateTime={published} pubdate="true">{datetimeLong(published)}</time>
      { isOwner && !visible &&
          <button onClick={publish}>Not published yet!</button> 
      }
      {
        isOwner &&
          <button>Edit</button>
      }
    </>
  )
}

export default Meta
