import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'

const Info = (props) => {
  const {info} = props
  return (
    <>
      <h2>Info</h2>
      <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(marked(info))}} />
    </>
  )
}

export default Info
