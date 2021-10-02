import {highlightSanitizedJS} from '../../utils/hljs'

const Teardown = (props) => {
  const {teardown} = props
  return (
    <>
      <h2>Teardown</h2>
      <pre>
        <code dangerouslySetInnerHTML={{__html: highlightSanitizedJS(teardown)}} />
      </pre>
    </>
  )
}

export default Teardown
