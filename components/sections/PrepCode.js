import {highlightSanitizedHTML} from '../../utils/hljs'
import Editor from '../Editor'

export default function PrepCode(props) {
  const {initHTML, setInitHTML} = props

  return (
    <div className="flex flex-col w-full">
      <button className="text-left font-bold my-0">Setup HTML</button>
      <Editor code={initHTML} onUpdate={setInitHTML} className={`html w-full p-0 border min-h-[10rem]`}  />
    </div>
  )

  // return (
  //   <>
  //     <h2 className="font-bold my-5">Preparation HTML</h2>
  //     <pre>
  //       <code style={{'whiteSpace': 'pre-wrap'}} dangerouslySetInnerHTML={{__html: highlightSanitizedHTML(prepCode)}} />
  //     </pre>
  //   </>
  // )
}
