import Head from 'next/head'

import { useState, useEffect, useRef } from 'react'

import { pagesCollection } from '../lib/mongodb'
import TestRunner from '../components/TestRunner'

import Layout from '../components/Layout'

import Title from '../components/sections/Title'
import Meta from '../components/sections/Meta'
import Revisions from '../components/sections/Revisions'
import Info from '../components/sections/Info'
import Setup from '../components/sections/Setup'
import Teardown from '../components/sections/Teardown'
import PrepCode from '../components/sections/PrepCode'

export default function SPA(props) {
  const [title, setTitle] = useState('')
  const [tests, setTests] = useState([
    {'title': 'Test #1', 'code': 'const a = 123'},
    {'title': 'Test #2', 'code': 'const b = 123'}
  ])

  const setupPlaceholder = `/* Any setup Javascript */`

  const [setup, setSetup] = useState(setupPlaceholder)

  const initHTMLPlaceholder = `<!-- e.g.
    <script type="module">
      import {throttle} from 'lodash';
    </script>
-->`

  const [initHTML, setInitHTML] = useState(initHTMLPlaceholder)

  const { 
    _id, 
    authorName, 
    info, 
    published, 
    revision, 
    slug, 
    teardown, 
    mirror,
  } = props.pageData

  const {revisions} = props

  return (
    <>
      <Head>
        <title>{`${title}${revision > 1 ? ` (v${revision})` : ''}`}</title>
        <meta
          name="description"
          content={`${title}${revision > 1 ? ` (v${revision})` : ''} - Online Javascript Benchmark${mirror ? ' - jsPerf.com mirror' : ''}`}
          key="desc"
        />
      </Head>
      <Layout>
        <hgroup>
          {/* <h1 className="text-2xl py-6 font-bold">{title}<span className="text-gray-400 text-base">{`${revision > 1 ? ` (v${revision})` : ''}`}</span></h1> */}
        </hgroup>
        <section className="flex items-center border-b border-blue-500 py-2">
          <Title title={title} setTitle={setTitle} />
          {/* <Meta pageData={props.pageData} /> */}
        </section>
        {info &&
          <section>
            <Info info={info} />
          </section>
        }
        <section>
          <PrepCode initHTML={initHTML} setInitHTML={setInitHTML} />
        </section>
        <section className="w-full">
          <Setup setup={setup} setSetup={setSetup} />
        </section>
        {teardown &&
          <section>
            <Teardown teardown={teardown} />
          </section>
        }
        <section>
          <TestRunner id={_id} tests={tests} initHTML={initHTML} setup={setup} teardown={teardown} />
        </section>
        <hr className="my-5" />
        <section>
          <Revisions revisions={revisions} slug={slug} revision={revision} />
        </section>
      </Layout>
    </>
  )
}

export const getStaticProps = async ({params}) => {
  const pages = await pagesCollection()

  return { 
    props: { 
      pageData: {},
      revisions: []
    }
  }
}

