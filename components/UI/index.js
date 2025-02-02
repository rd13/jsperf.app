"use client"

import { useState } from 'react'

import buttonStyles from '@/styles/buttons.module.css'
import Title from '@/components/sections/Title'
import Meta from '@/components/sections/Meta'
import TestRunner from '@/components/TestRunner'
import {Accordian, AccordianItem} from '@/components/Accordian'
import Editor from '@/components/Editor'

export default function UI(props) {
  const { editable } = props

  const pageData = {
    initHTML: '',
    setup: '',
    teardown: '',
    title: '',
    tests: [
      { title: 'Underscore Flatten', code: 'const a = 234' },
      { title: 'Native Flatten', code: 'const a = 345435' }
    ]
  }


  // Code block states
  const [codeBlockInitHTML, setCodeBlockInitHTML] = useState(pageData?.initHTML || '')
  const [codeBlockSetup, setCodeBlockSetup] = useState(pageData?.setup || '')
  const [codeBlockTeardown, setCodeBlockTeardown] = useState(pageData?.teardown || '')

  const formDefaults = Object.assign({}, {
    title: '',
    info: '',
    slug: '',
    visible: false
  }, pageData)

  const submitFormHandler = (event) => {
    event.preventDefault()

    const formData = (({
      title, 
      info
    }) => ({
      title: title?.value || '', 
      info: info?.value || ''
    }))( event.target )

    formData.slug = formDefaults.slug

    formData.initHTML = codeBlockInitHTML

    console.log(formData)
  }

  return (
    <>
      <form onSubmit={submitFormHandler}>
        <section>
          <Title editable={editable} title={pageData.title} />
        </section>
          
        <br />
        <section>
          <button className="bg-gray-300 mr-2 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded">
            + Description
          </button>

          <button className="bg-gray-300 mr-2 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded">
            + Library
          </button>

          <button className="bg-gray-300 mr-2 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded">
            + Setup
          </button>

          <button className="bg-gray-300 mr-2 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded">
            + Teardown
          </button>

          {/* <button className="bg-blue-300 mr-2 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"> */}
          {/*   Test Environment */}
          {/* </button> */}
        </section>

          {/* <input type="text" className="w-full text-md px-2 my-1" placeholder="Description (optional)" /> */}

          {/* <Accordian> */}
          {/*   <AccordianItem title="Setup HTML"> */}
          {/*     <Editor code={codeBlockInitHTML} onUpdate={setCodeBlockInitHTML} className="html w-full p-2 border" style={{minHeight: "150px"}} /> */}
          {/*   </AccordianItem> */}
          {/*  */}
          {/*   <AccordianItem title="Setup Javascript"> */}
          {/*   </AccordianItem> */}
          {/* </Accordian> */}

        <section>
          <TestRunner tests={pageData.tests} initHTML={pageData.initHTML} setup={pageData.setup} teardown={pageData.teardown} />

        </section>
        <br />
        {/* <section> */}
        {/*   <Accordian> */}
        {/*     <AccordianItem title="Teardown"> */}
        {/*     </AccordianItem> */}
        {/*   </Accordian> */}
        {/* </section> */}
        {/* <br />  */}

        <section className="flex justify-end">
          <button type="submit" className={`${buttonStyles.default}`}>Save</button>
        </section>
      </form>
    </>
  )
}
