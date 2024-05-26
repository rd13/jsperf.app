import { highlightSanitizedHTML } from '@/utils/hljs'

export default function PrepCode(props) {
  const {prepCode} = props

  return (
    <>
      <h2 className="font-bold my-5">Preparation HTML</h2>
      <pre>
        <code style={{'whiteSpace': 'pre-wrap'}} dangerouslySetInnerHTML={{__html: highlightSanitizedHTML(prepCode)}} />
      </pre>
    </>
  )
}
