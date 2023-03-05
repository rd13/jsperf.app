import { useState, useEffect, useRef } from 'react'
import Router from 'next/router'
import { signIn, useSession } from "next-auth/react"
import GitHubIcon from '../GitHubIcon'
import buttonStyles from '../../styles/buttons.module.css'
import formStyles from '../../styles/forms.module.css'
import UUID from '../UUID'

import Editor from '../Editor'

const TestCaseFieldset = ({index, remove, test, update}) => {
  return (
    <fieldset name="testCase">
      <div>
        <h2 className="text-gray-400 mx-5 w-full md:w-1/4 text-right">Code snippet #{index + 1} {remove && <button type="button" onClick={() => remove(index)}>Remove</button>}</h2>
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
  const { data: session } = useSession()
  const uuid = UUID()

  const [codeBlockInitHTML, setCodeBlockInitHTML] = useState(pageData?.initHTML || '')
  const [codeBlockSetup, setCodeBlockSetup] = useState(pageData?.setup || '')
  const [codeBlockTeardown, setCodeBlockTeardown] = useState(pageData?.teardown || '')

  const [testsState, setTestsState] = useState(pageData?.tests || [{}, {}])

  // Test state update functions
  const testsRemove = (index = testsState.length - 1) => {
    console.log('removing test', index)
    setTestsState(tests => tests.splice(index, 1) && [...tests])
  }

  const testsAdd = () => {
    setTestsState(tests => tests.push({}) && [...tests])
  }

  const testsUpdate = (test, index) => {
    console.log('updating test state for: ', index)
    setTestsState(tests => tests[index] = {...tests[index], ...test} && tests)
  }

  const onUpdate = (data, index) => {
    console.log('updating test state for: ', index)
    testsState[index] = {...testsState[index], ...data}
    setTestsState(testsState)
  }


  // Default form values if none are provided via props.pageData
  const formDefaults = Object.assign({}, {
    title: '',
    info: '',
    slug: '',
    visible: false,
    tests: []
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

    // Get a list of test case fieldset elements referenced by name="testCase"
    const formTestCases = event.target.elements.testCase

    // Select which element values to include in payload, reference by name=title,slug,async
    formData.tests = [...formTestCases].map(testCase => (
      {
        title: testCase.elements.testTitle.value,
        'async': testCase.elements.async.checked,
        code: testCase.elements.code.value
      }
    ))

    // const isOwner = session && pageData?.githubID === session?.user?.id
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

  console.log('running edit form init')

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
            return <TestCaseFieldset key={i} {...optionalProps} index={i} test={testsState[i]} update={e => {onUpdate(e, i)}} />
          })
        }
      </fieldset>
      <div className="flex my-5 items-center">
        <div className="flex-1">
          <button type="button" className="underline hover:no-underline" onClick={testsAdd}>Add code snippet</button>
        </div>
        <button type="submit" className={buttonStyles.default}>Save test case</button>
      </div>
    </form>
  )
}
