import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

import hljs from '../utils/hljs'

import javascript from 'highlight.js/lib/languages/javascript'
hljs.registerLanguage('javascript', javascript);
import {CodeJar} from 'codejar'

export const Editor = (props) => {
  const {code} = props;

  const editorRef = useRef(<div></div>)
  const jarRef = useRef(CodeJar)

  useEffect(() => {
    console.log(code)
    jarRef.current = CodeJar(editorRef.current, hljs.highlightElement)

    jarRef.current.updateCode(code)
  }, []);

  return <div ref={editorRef} className="javascript"></div>
}

export default Editor
