import { highlightSanitizedJS } from '@/utils/hljs'

export default function Setup(props) {
  const {setup} = props
  return (
    <>
      <h2 className="font-bold my-5">Setup</h2>
      <pre className="max-h-80 overflow-scroll">
        <code className="language-javascript" dangerouslySetInnerHTML={{__html: highlightSanitizedJS(setup)}} />
      </pre>
    </>
  )
}
