import { pagesCollection } from '../../../lib/mongodb'
import { useState, useEffect } from 'react'
import buttonStyles from '../../../styles/buttons.module.css'
import formStyles from '../../../styles/forms.module.css'

const TestCaseFieldset = (props) => {
  const {index} = props
  return (
    <fieldset name="testCase">
      <h2>Code snippet {index + 1}</h2>
      <div>
        <label htmlFor="testTitle">Title</label>
        <input type="text" name="testTitle" />
      </div>
      <div>
        <label htmlFor="async">Async</label>
        <input type="checkbox" name="async" />
      </div>
      <div>
        <label htmlFor="code" className="y-top">Description <span>(in case you feel further explanation is needed)</span><span>(Markdown syntax is allowed)</span> </label>
        <textarea name="code" maxLength="16777215"></textarea>
      </div>
    </fieldset>
  )
}

export default function Edit(props) {
  const { slug, revision, title } = props.pageData

  const newTestCase = async event => {
    event.preventDefault()

    const form = event.target

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
    }))(form)

    // Select test case fieldset elements referenced by name="testCase"
    const formTestCases = form.elements.testCase

    // Map each HTMLCollection and select elements to include in request payload by name="title/slug/etc"
    formData.tests = [...formTestCases].map(testCase => (
      {
        title: testCase.elements.testTitle.value,
        'async': testCase.elements.async.value,
        code: testCase.elements.code.value
      }
    ))

    console.log(formData)

    // save the post
    const response = await fetch('/api/tests', {
      method: 'POST',
      body: JSON.stringify(formData),
    })

    const data = await response.json();
    console.log(data)
    // console.log(e.target.slug.value)
  }

  // The number of test cases to render in the form
  const [noTestCases, setNoTestCases] = useState(2)

  let testCaseFieldsets = []

  for (let i = 0; i < noTestCases; i++)  {
    testCaseFieldsets.push(<TestCaseFieldset key={i} index={i} />)
  }

  return (
    <>
      <h1>Edit: {slug} - {revision}</h1>
      <form onSubmit={newTestCase} className={formStyles.editForm}>
        <fieldset>
          <div className="w-full bg-blue text-white"><h3>Test case details</h3></div>
          <div>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" defaultValue={title} />
          </div>
          <div>
            <label htmlFor="slug">Slug</label>
            <input type="text" id="slug" name="slug" defaultValue={slug} />
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
            <textarea name="initHTML" id="initHTML" maxLength="16777215"></textarea>
          </div>
          <div>
            <label htmlFor="setup" className="y-top">Setup</label>
            <textarea name="setup" id="setup" maxLength="16777215"></textarea>
          </div>
          <div>
            <label htmlFor="teardown" className="y-top">Teardown</label>
            <textarea name="teardown" id="teardown" maxLength="16777215"></textarea>
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
    </>
  )
}

export async function getStaticProps({params}) {
  const { slug, revision } = params
  console.log(slug, revision)

  const pages = await pagesCollection()

  const pageData = await pages.findOne({
    slug, revision: parseInt(revision) || 1
  }, {projection: { _id: 0 }})

  return {
    props: { 
      pageData: JSON.parse(JSON.stringify(pageData))
    },
    revalidate: 60
  }
}

export async function getStaticPaths() {
  const pages = await pagesCollection()

  const pagesQuery = await pages.find({}, {
    projection: { slug: 1, revision: 1, _id: 0 }
  }).toArray()

  const paths = pagesQuery.map(page => {
    return {
      params: {
        /**
         * /test-case/3/edit
         */
        slug: page.slug,
        revision: `${page.revision}`
      }
    }
  })

  return {
    paths,
    fallback: 'blocking'
  };
}
