import { useState, useEffect } from 'react'
import Router from 'next/router'
import buttonStyles from '../../styles/buttons.module.css'
import formStyles from '../../styles/forms.module.css'

const TestCaseFieldset = ({index, remove, test}) => {
  return (
    <fieldset name="testCase">
      <h2>Code snippet {index + 1} {remove && <a href="" onClick={remove}>Remove</a>}</h2>
      <div>
        <label htmlFor="testTitle">Title</label>
        <input type="text" name="testTitle" required defaultValue={test && test.title} />
      </div>
      <div>
        <label htmlFor="async">Async</label>
        <input type="checkbox" name="async" defaultValue={test && test.async} />
      </div>
      <div>
        <label htmlFor="code" className="y-top">Description <span>(in case you feel further explanation is needed)</span><span>(Markdown syntax is allowed)</span> </label>
        <textarea name="code" maxLength="16777215" required defaultValue={test && test.code} />
      </div>
    </fieldset>
  )
}

export default function EditForm({pageData}) {
  // Default form values if none are provided via props.pageData
  const formDefaults = Object.assign({}, {
    slug: '',
    title: '',
    initHTML: '',
    setup: '',
    teardown: '',
    tests: []
  }, pageData)

  const [slug, setSlug] = useState(formDefaults.slug)
  const [title, setTitle] = useState(formDefaults.title)

  // manualSlug is a state var so that that we stop auto generating a slug from the 
  // title when a slug is manually entered
  const [manualSlug, setManualSlug] = useState(false)

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleSlugChange = (event) => {
    setSlug(event.target.value)
    setManualSlug(true)
  }

  useEffect(() => {
    // Make the slug url friendly
    const formattedSlug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Only update if a slug has not been manually defined
    !manualSlug && setSlug(formattedSlug)
  }, [title, manualSlug, setSlug])

  const submitFormHandler = async event => {
    event.preventDefault()

    // Pick fields referenced by their ID from the form to include in request payload
    // Uses IIFE to destructure event.target. event.target is the form.
    const formData = (({
      title, 
      slug,
      visible,
      info,
      initHTML,
      setup,
      teardown
    }) => ({
      title: title.value, 
      slug: slug.value,
      visible: visible.checked,
      info: info.value,
      initHTML: initHTML.value,
      setup: setup.value,
      teardown: teardown.value
    }))( event.target )

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

    console.log(formData)

    // Send payload to tests API
    const response = await fetch('/api/tests', {
      method: 'POST',
      body: JSON.stringify(formData),
    })


    const {success, created} = await response.json();

    if (success) {
      // redirect to test page
      Router.push(`/${created.slug}/${created.revision}`)
    }
    // console.log(e.target.slug.value)
  }

  // The number of test cases to render in the form
  const [noTestCases, setNoTestCases] = useState(formDefaults.tests.length || 2)

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
    <form onSubmit={submitFormHandler} className={formStyles.editForm}>
      <fieldset>
        <div className="w-full bg-blue text-white"><h3>Test case details</h3></div>
        <div>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" value={title} onChange={handleTitleChange} required />
        </div>
        <div>
          <label htmlFor="slug">Slug</label>
          <input type="text" id="slug" name="slug" value={slug} pattern="[A-Za-z0-9](?:-?[A-Za-z0-9])*" onChange={handleSlugChange} required />
          <small>https://jsperf.app/{slug}</small>
        </div>
        <div>
          <label htmlFor="visible">Published</label>
          <input type="checkbox" name="visible" id="visible" />(uncheck if you want to fiddle around before making the page public)
        </div>
        <div>
          <label htmlFor="info" className="y-top">Description <span>(in case you feel further explanation is needed)</span><span>(Markdown syntax is allowed)</span> </label>
          <textarea name="info" id="info" maxLength="16777215"></textarea>
        </div>
      </fieldset>
      <fieldset>
        <div className="w-full bg-blue text-white"><h3>Preparation Code</h3></div>
        <div>
          <label htmlFor="initHTML" className="y-top">Preparation code HTML<span>(this will be inserted in the <code>{`<body>`}</code> of a valid HTML5 document in standards mode)<br />(useful when testing DOM operations or including libraries)</span></label>
          <textarea name="initHTML" id="initHTML" maxLength="16777215" defaultValue={formDefaults.initHTML}></textarea>
        </div>
        <div>
          <label htmlFor="setup" className="y-top">Setup</label>
          <textarea name="setup" id="setup" maxLength="16777215" defaultValue={formDefaults.setup}></textarea>
        </div>
        <div>
          <label htmlFor="teardown" className="y-top">Teardown</label>
          <textarea name="teardown" id="teardown" maxLength="16777215" defaultValue={formDefaults.teardown}></textarea>
        </div>
      </fieldset>
      <fieldset>
        <div className="w-full bg-blue text-white"><h3>Test cases</h3></div>
        {testCaseFieldsets}
      </fieldset>
      <div className={buttonStyles.groupRight}>
        <button type="button" className={buttonStyles.default} onClick={() => setNoTestCases(noTestCases + 1)}>Add code snippet</button>
        <button type="submit" className={buttonStyles.default}>Save test case</button>
      </div>
    </form>
  )
}
