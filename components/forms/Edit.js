import { useState, useEffect } from 'react'
import Router from 'next/router'
import { signIn, useSession } from "next-auth/react"
import GitHubIcon from '../GitHubIcon'
import buttonStyles from '../../styles/buttons.module.css'
import formStyles from '../../styles/forms.module.css'
import accordianStyles from '../../styles/accordian.module.css'
import TestRunner from '../TestRunner'
import UUID from '../UUID'
import {Accordian, AccordianItem} from './Accordian'

const TestCaseFieldset = ({index, remove, test}) => {
  return (
    <fieldset name="testCase">
      <div>
        <h2 className="text-gray-400 mx-5 w-full md:w-1/4 text-right">Code snippet #{index + 1} {remove && <a href="" onClick={remove}>Remove</a>}</h2>
      </div>
      <div>
        <label htmlFor="testTitle">Title <span className="text-red-600">*</span></label>
        <input type="text" name="testTitle" required defaultValue={test && test.title} />
      </div>
      <div>
        <label htmlFor="async">Async</label>
        <input type="checkbox" name="async" defaultValue={test && test.async} />
      </div>
      <div>
        <label htmlFor="code" className="self-start">Code <span className="text-red-600">*</span></label>
        <textarea name="code" rows="5" maxLength="16777215" required defaultValue={test && test.code} />
      </div>
    </fieldset>
  )
}

export default function EditForm({pageData}) {
  const { data: session } = useSession()
  const uuid = UUID()

  // Default form values if none are provided via props.pageData
  const formDefaults = Object.assign({}, {
    title: '',
    info: '',
    slug: '',
    visible: false,
    initHTML: '',
    setup: '',
    teardown: '',
    tests: []
  }, pageData)

  const submitFormHandler = async event => {
    event.preventDefault()

    // Pick fields referenced by their ID from the form to include in request payload
    // Uses IIFE to destructure event.target. event.target is the form.
    const formData = (({
      title, 
      initHTML,
      setup,
      teardown
    }) => ({
      title: title.value, 
      initHTML: initHTML.value,
      setup: setup.value,
      teardown: teardown.value
    }))( event.target )

    formData.slug = formDefaults.slug

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

    console.log(success, message, data)

    if (success) {
      // redirect to SSR preview page
      Router.push(`/${data.slug}/${data.revision}/preview`)
    }
  }

  // The number of test cases to render in the form
  const [noTestCases, setNoTestCases] = useState(formDefaults.tests.length || 2)

  const [tests, setTests] = useState(pageData.tests)

  let testCaseFieldsets = []

  let conditionalProps = {}

  for (let i = 0; i < noTestCases; i++)  {
    // If we are creating from an existing test
    conditionalProps.test = formDefaults.tests[i] ? formDefaults.tests[i] : {}

    // Add a remove prop to the last test
    if (i === noTestCases - 1 && i > 1) {
      conditionalProps.remove = (event) => {
        event.preventDefault()
        setNoTestCases(noTestCases - 1)
      }
    }

    testCaseFieldsets.push(<TestCaseFieldset key={i} index={i} {...conditionalProps} />)
  }

  return (
    <form onSubmit={submitFormHandler} className={`${formStyles.editForm} w-full`}>

      <fieldset>
        <div>
          <input type="text" id="title" name="title" defaultValue={formDefaults.title} placeholder="Title (optional)" className="w-full text-2xl" />
        </div>
      </fieldset>

      {/* Begin Section Benchmark Setup */}
      <h3 className="bg-blue-500">Benchmark Setup</h3>
      <Accordian>
        <AccordianItem title="HTML">
          <label htmlFor="initHTML" className="self-start">Preparation HTML <br /><span className="text-gray-300 font-normal">(this will be inserted in the <code>{`<body>`}</code> of a valid HTML5 document in standards mode)<br />(useful when testing DOM operations or including libraries)</span></label>
            <textarea name="initHTML" id="initHTML" rows="8" maxLength="16777215" defaultValue={formDefaults.initHTML}></textarea>
        </AccordianItem>

        <AccordianItem title="Setup" open>
          <label htmlFor="setup" className="self-start">Setup block <br /><span className="text-gray-300 font-normal">(run before every test, include vars and functions to be used in your tests)</span></label>
          <textarea name="setup" id="setup" rows="5" maxLength="16777215" defaultValue={formDefaults.setup}></textarea>
        </AccordianItem>

        <AccordianItem title="Teardown">
          <label htmlFor="teardown" className="self-start">Teardown</label>
          <textarea name="teardown" id="teardown" rows="5" maxLength="16777215" defaultValue={formDefaults.teardown}></textarea>
        </AccordianItem>
      </Accordian>
      {/* End Section Benchmark Setup */}

      <section>
        <TestRunner tests={tests} onTestChange={setTests} id="edit" editable={true} />
      </section>

      <fieldset>
        <h3 className="bg-blue-500">Test cases</h3>
        {testCaseFieldsets}
      </fieldset>
      <div className="flex my-5 items-center">
        <div className="flex-1">
          <button type="button" className="underline hover:no-underline" onClick={() => setNoTestCases(noTestCases + 1)}>Add code snippet</button>
        </div>
        <button type="submit" className={buttonStyles.default}>Save test case</button>
      </div>
    </form>
  )
}
