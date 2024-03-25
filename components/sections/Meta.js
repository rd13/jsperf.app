import { datetimeLong } from '../../utils/Date'
import { useState } from 'react'
import styles from './Meta.module.css'

export default function Meta(props) {
  const {revision, authorName, published} = props.pageData
  const {title, setTitle} = props

  return (
    <>
    <input type="text" defaultValue={title} onChange={event => setTitle(event.target.value)}  />
      <h2 className="text-md">
        {revision > 1
            ? <span>Revision {revision} of this benchmark created </span>
            : <span>Benchmark created </span>
        }
        { authorName && <span> by {authorName} </span>}
        on <time dateTime={published} pubdate="true">{datetimeLong(published)}</time>
      </h2>
    </>
  )
}
