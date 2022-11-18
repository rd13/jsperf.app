import {highlightSanitizedJS} from '../../utils/hljs'

const Teardown = (props) => {
  const {teardown} = props
  return (
    <>
      <h2 className="font-bold my-5">Teardown</h2>
      <pre className="max-h-80 overflow-scroll">
        <code dangerouslySetInnerHTML={{__html: highlightSanitizedJS(teardown)}} />
      </pre>
    </>
  )
}

export default Teardown
