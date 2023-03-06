import { useState, useEffect, useRef } from 'react'
import Router from 'next/router'
import { signIn, useSession } from "next-auth/react"
import GitHubIcon from '../GitHubIcon'
import buttonStyles from '../../styles/buttons.module.css'
import formStyles from '../../styles/forms.module.css'
import UUID from '../UUID'
import MinusIcon from '../MinusIcon'

import Editor from '../Editor'

const TestCaseFieldset = ({index, remove, test, update}) => {
  return (
    <fieldset name="testCase">
      <div>
        <h2 className="mx-5 w-full md:w-1/4 text-black font-bold text-right">
          {
            remove && 
              <button className="align-middle mr-2" type="button" onClick={() => remove(index)}>
                <MinusIcon fill="#000000" width={20} height={20} className="fill-inherit" />
              </button>
          }
          Test #{index + 1}
        </h2>
      </div>
      <div>
        <label htmlFor="testTitle">Title <span className="text-red-600">*</span></label>
        <input type="text" name="testTitle" onChange={event => update({"title": event.target.value}, index)} required defaultValue={test && test.title} />
      </div>
      <div>
        <label htmlFor="async">Async</label>
        <input type="checkbox" name="async" onChange={event => update({"async": event.target.checked}, index)} defaultValue={test && test.async} />
      </div>
      <div>
        <label htmlFor="code" className="self-start">Code <span className="text-red-600">*</span></label>
        <Editor code={test && test.code} onUpdate={code => update({code}, index)} className="javascript w-full md:w-1/2 p-2 border" style={{minHeight: "150px"}} />
      </div>
    </fieldset>
  )
}

export default function EditForm({pageData}) {
  const uuid = UUID()

  // Code block states
  const [codeBlockInitHTML, setCodeBlockInitHTML] = useState(pageData?.initHTML || '')
  const [codeBlockSetup, setCodeBlockSetup] = useState(pageData?.setup || '')
  const [codeBlockTeardown, setCodeBlockTeardown] = useState(pageData?.teardown || '')

  // Test states
  const testDefault = {title: '', code: '', 'async': false}

  const [testsState, setTestsState] = useState(pageData?.tests || [testDefault, testDefault])

  const testsRemove = (index = testsState.length - 1) => {
    console.log('removing ', index)
    testsState.splice(index, 1)
    console.log(testsState)
    setTestsState([...testsState])
  }
  console.log('re render')

  const testsAdd = () => {
    setTestsState(tests => tests.push(testDefault) && [...tests])
  }

  const testsUpdate = (test, index) => {
    testsState[index] = {...testsState[index], ...test}
    setTestsState(testsState)
  }

  // Default form values if none are provided via props.pageData
  const formDefaults = Object.assign({}, {
    title: '',
    info: '',
    slug: '',
    visible: false
  }, pageData)

  const submitFormHandler = async event => {
    event.preventDefault()

    console.log(testsState)
    return

    // Pick fields referenced by their ID from the form to include in request payload
    // Uses IIFE to destructure event.target. event.target is the form.
    const formData = (({
      title, 
      info
    }) => ({
      title: title.value, 
      info: info.value
    }))( event.target )

    formData.slug = formDefaults.slug

    formData.initHTML = codeBlockInitHTML
    formData.setup = codeBlockSetup
    formData.teardown = codeBlockTeardown
    formData.tests = testsState

    const isPublished = !!pageData?.visible

    // Editing an existing document
    if (pageData?.revision) {
      formData.revision = pageData.revision
    }

    // Include UUID in payload
    formData.uuid = uuid

    // Send form data to tests API
    const response = await fetch('/api/page', {
      method: (isPublished || !pageData) ? 'POST' : 'PUT',
      body: JSON.stringify(formData),
    })

    const {success, message, data} = await response.json()

    if (success) {
      // redirect to SSR preview page
      Router.push(`/${data.slug}/${data.revision}/preview`)
    }
  }

  return (
    <form onSubmit={submitFormHandler} className={`${formStyles.editForm} w-full`}>
      <fieldset>
        <h3 className="bg-blue-500">Test case details</h3>
        <div>
          <label htmlFor="title">
            Title <span className="text-red-600">*</span>
          </label>
          <input type="text" id="title" name="title" defaultValue={formDefaults.title} required />
        </div>
        <div>
          <label htmlFor="info" className="self-start">Description <br /><span className="text-gray-300 font-normal">(Markdown syntax is allowed)</span> </label>
          <textarea name="info" id="info" rows="5" maxLength="16777215" defaultValue={formDefaults.info}></textarea>
        </div>
      </fieldset>
      <fieldset>
        <h3 className="bg-blue-500">Preparation Code</h3>

        <div>
          <label htmlFor="initHTML" className="self-start">Preparation HTML <br /><span className="text-gray-300 font-normal">(this will be inserted in the <code>{`<body>`}</code> of a valid HTML5 document in standards mode)<br />(useful when testing DOM operations or including libraries)</span></label>
          <Editor code={codeBlockInitHTML} onUpdate={setCodeBlockInitHTML} className="html w-full md:w-1/2 p-2 border" style={{minHeight: "150px"}} />
        </div>

        <div>
          <label htmlFor="setup" className="self-start">Setup JS</label>
          <Editor code={codeBlockSetup} onUpdate={setCodeBlockSetup} className="javascript w-full md:w-1/2 p-2 border" style={{minHeight: "150px"}} />
        </div>

        <div>
          <label htmlFor="teardown" className="self-start">Teardown JS</label>
          <Editor code={codeBlockTeardown} onUpdate={setCodeBlockTeardown} className="javascript w-full md:w-1/2 p-2 border" style={{minHeight: "150px"}} />
        </div>

      </fieldset>
      <fieldset>
        <h3 className="bg-blue-500">Test cases</h3>
        { 
          testsState.map((t,i) => {
            const optionalProps = {}
            i > 1 && (optionalProps.remove = testsRemove)
            return <TestCaseFieldset key={i} {...optionalProps} index={i} test={testsState[i]} update={e => {testsUpdate(e, i)}} />
          })
        }
      </fieldset>
      <div className="flex my-5 items-center">
        <div className="flex-1">
          <button type="button" className="underline hover:no-underline" onClick={testsAdd}>Add test</button>
        </div>
        <button type="submit" className={buttonStyles.default}>Save test case</button>
      </div>
    </form>
  )
}
