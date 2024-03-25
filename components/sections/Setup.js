import {highlightSanitizedJS} from '../../utils/hljs'
import { useState } from 'react'
import Editor from '../Editor'

export default function Setup(props) {
  const {setup, setSetup} = props

  const [navState, setNavState] = useState({ "setup": true });

  const ToggleNavState = id => {
    navState[id] = !navState[id]
    setNavState({...navState});
   };

  return (
    <>
      <div className="flex flex-col w-full">
        <button className="text-left font-bold my-2" onClick={() => ToggleNavState('setup')}>Setup Javascript</button>
        <Editor code={setup} onUpdate={setSetup} className={`javascript w-full p-0 border min-h-[10rem] ${navState.setup ? 'p-5 visible' : 'h-0 invisible min-h-[0rem]'}`}  />
      </div>
      <div className="flex flex-col w-full">
        <button className="text-left font-bold my-0" onClick={() => ToggleNavState('setup')}>+ Teardown Javascript</button>
      </div>
    </>
  )
  // return (
  //   <>
  //     <h2 className="font-bold my-5">Setup</h2>
  //     <pre className="max-h-80 overflow-scroll">
  //       <code dangerouslySetInnerHTML={{__html: highlightSanitizedJS(setup||'')}} />
  //     </pre>
  //   </>
  // )
}
