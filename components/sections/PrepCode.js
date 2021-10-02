import {highlightSanitizedHTML} from '../../utils/hljs'

const PrepCode = (props) => {
  const {prepCode} = props

  return (
    <>
      <h2>Preparation HTML</h2>
      <pre>
        <code style={{'whiteSpace': 'pre-wrap'}} dangerouslySetInnerHTML={{__html: highlightSanitizedHTML(prepCode)}} />
      </pre>
    </>
  )
}

export default PrepCode
