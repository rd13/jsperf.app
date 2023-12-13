import {datetimeLong} from '../../utils/Date'
import Link from 'next/link'

export default function Revisions(props) {
  const {revisions, slug, revision} = props
  return (
    <>
    <h2 className="font-semibold">Revisions</h2>
    <p className="my-5">You can <a href={`/${slug}/${revision}/edit`}>edit these tests or add more tests to this page</a> by appending /edit to the URL.</p>
      <ul>
        {revisions.map((pageData, index) => {
          const {revision, slug, authorName, published} = pageData
          return (
            <li key={index}>
              <a href={revision === 1 ? `/${slug}` : `/${slug}/${revision}`}>
                Revision {revision}
              </a>: published {authorName && <span>by {authorName} </span>}on <time dateTime={published}>
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
