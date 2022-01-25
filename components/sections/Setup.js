import {highlightSanitizedJS} from '../../utils/hljs'

const Setup = (props) => {
  const {setup} = props
  return (
    <>
      <h2 className="font-bold my-5">Setup</h2>
      <pre className="max-h-80 overflow-scroll">
        <code dangerouslySetInnerHTML={{__html: highlightSanitizedJS(setup)}} />
      </pre>
    </>
  )
}

export default Setup
