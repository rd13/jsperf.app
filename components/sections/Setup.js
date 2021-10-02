import {highlightSanitizedJS} from '../../utils/hljs'

const Setup = (props) => {
  const {setup} = props
  return (
    <>
      <h2>Setup</h2>
      <pre>
        <code dangerouslySetInnerHTML={{__html: highlightSanitizedJS(setup)}} />
      </pre>
    </>
  )
}

export default Setup
