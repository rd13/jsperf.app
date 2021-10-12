import { pagesCollection } from '../../../lib/mongodb'
import { useState, useEffect } from 'react'

const TestCaseFieldset = (props) => {
  const {index} = props
  return (
    <fieldset name="testCase">
      <input type="text" name="title" />
      <input type="text" name="sdfsdf" />
    </fieldset>
  )
}

export default function Edit(props) {
  const { slug, revision, title } = props.pageData

  const newTestCase = async (e) => {
    e.preventDefault()

    // Pick fields referenced by their ID from the form to include in request payload
    // Uses IIFE to destructure event.target. event.target is the form.
    const formData = (({title, slug}) => ({title:title.value, slug:slug.value}))(e.target)

    // Select test case fieldset elements referenced by name="testCase"
    const formTestCases = e.target.elements.testCase

    // Map each HTMLCollection and select elements to include in request payload by name="title/slug/etc"
    formData.tests = [...formTestCases].map(testCase => (
      {
        title: testCase.elements.title.value,
        'async': testCase.elements.async.value,
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
      <form onSubmit={newTestCase}>
        <label>Title</label>
        <input type="text" id="title" name="title" defaultValue={title} />
        <label>Slug</label>
        <input type="text" id="slug" name="slug" defaultValue={slug} />
        {testCaseFieldsets}
        <button type="button" onClick={() => setNoTestCases(noTestCases + 1)}>Add test case</button>
        <button type="submit">Save test case</button>
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
