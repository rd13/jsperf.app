import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

import hljs from '../utils/hljs'

import {CodeJar} from 'codejar'

export const Editor = (props) => {
  const {code, onUpdate, style, className} = props

  const editorRef = useRef(<div></div>)
  const jarRef = useRef(CodeJar)

  useEffect(() => {
    jarRef.current = CodeJar(editorRef.current, hljs.highlightElement)

    jarRef.current.updateCode(code)

    jarRef.current.onUpdate(txt => {
      // Need to debounce this
      onUpdate(txt)
    });
  }, []);

  // useEffect(() => {
  //   console.log('update', props.code)
  //   jarRef.current.updateCode(props.code);
  //   // setCurrentCursorPosition(editorRef.current, cursorOffset);
  // }, [props.code]);

  return <div ref={editorRef} className={className} style={style}></div>
}

export default Editor
