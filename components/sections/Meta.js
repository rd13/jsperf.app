import {datetimeLong} from '../../utils/Date'

const Meta = (props) => {
  const {revision, authorName, published} = props.pageData
  return (
    <>
      {revision > 1
          ? <span>Revision {revision} of this test case created </span>
          : <span>Test case created </span>
      }
      { authorName && <span> by {authorName} </span>}
      on <time dateTime={published} pubdate="true">{datetimeLong(published)}</time>
    </>
  )
}

export default Meta
