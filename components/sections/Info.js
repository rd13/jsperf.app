import { marked } from 'marked'
import { highlightSanitizedMarkdown } from '@/utils/hljs'

export default function Info(props) {
  const {info} = props
  return (
    <>
      <h2 className="font-bold my-5">Description</h2>
      <div className="markdown" dangerouslySetInnerHTML={{__html: highlightSanitizedMarkdown(marked(info))}}></div>
    </>
  )
}
