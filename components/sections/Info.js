import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'

const Info = (props) => {
  const {info} = props
  return (
    <>
      <h2 className="font-bold my-5">Description</h2>
      <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(marked(info))}} />
    </>
  )
}

export default Info
