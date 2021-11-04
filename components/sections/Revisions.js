import {datetimeLong} from '../../utils/Date'
import Link from 'next/link'

const Revisions = (props) => {
  const {revisions, slug, revision} = props
  return (
    <>
      <h2>Revisions</h2>
    <p>You can <a href={`/${slug}/${revision}/edit`}>edit these tests or add even more tests to this page</a> by appending /edit to the URL.</p>
      <ul>
        {revisions.map((pageData, index) => {
          const {revision, slug, authorName, published} = pageData
          return (
            <li key={index}>
              <Link href={revision === 1 ? `/${slug}` : `/${slug}/${revision}`}>
                <a>Revision {revision}</a>
              </Link>: published {authorName && <span>by {authorName} </span>}on <time dateTime={published}>
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
