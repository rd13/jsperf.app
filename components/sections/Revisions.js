import {datetimeLong} from '../../utils/Date'

const Revisions = (props) => {
  const {revisions} = props
  return (
    <>
      <h2>Revisions</h2>
      <ul>
        {revisions.map((pageData, index) => {
          const {revision, slug, authorName, published} = pageData
          return (
            <li key={index}>
              <a href={revision === 1 ? `/${slug}` : `/${slug}/${revision}`}>Revision {revision}</a>: published {authorName && <span>by {authorName} </span>}on <time dateTime={published}>
                {datetimeLong(published)}
              </time>
            </li>
          )
        }
        )}
      </ul>
    </>
  )
}

export default Revisions
