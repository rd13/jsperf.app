import { datetimeLong } from '../../utils/Date'
import { useState } from 'react'
import styles from './Meta.module.css'

const Meta = (props) => {
  const {revision, authorName, published} = props.pageData

  return (
    <>
      <h2 className="text-xl">
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

export default Meta
