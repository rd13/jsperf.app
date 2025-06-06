"use client"

import { signIn, useSession } from "@/app/lib/auth-client"
import { useState, useEffect } from 'react'
import GitHubIcon from './GitHubIcon'
import Link from 'next/link'

export default function Header(props) {
  const { data: session, status } = useSession()
  const { navState: navStateInitial } = props

  const [navState, setNavState] = useState({ "about": false, ...navStateInitial});

  const ToggleNavState = id => {
    navState[id] = !navState[id]
    setNavState({...navState}); 
   };

  const { login } = session?.user?.profile || {}

  return (
    <header>
      <nav className="flex items-center justify-between flex-wrap py-2">
        <div className="flex items-center flex-shrink-0 mr-6">
          <a href="/" className="no-underline text-black">
            <span className="sr-only">jsPerf Home Page</span>
            <span className="font-semibold text-2xl tracking-tight">jsPerf.app</span>
          </a>
        </div>
        <div className="block lg:hidden">
          <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
          </button>
        </div>
        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
          <div className="text-sm lg:flex-grow">
            <a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 text-gray-400 hover:text-white mr-4">
              &nbsp;
            </a>
          </div>
          { !session &&
          <div>
            <button className="flex items-center inline-block text-sm px-4 py-2 hover:fill-blue-500 hover:text-blue-500 lg:mt-0" onClick={() => signIn.social({provider: "github"})}>
              <span>Sign In</span>
              <GitHubIcon fill="#000000" width={16} height={16} className="ml-2 fill-inherit" />
            </button>
          </div>
          }
          {
          session &&
          <div>
            <a href={`/u/${session?.user?.profile?.id}`} className="no-underline text-black flex items-center inline-block text-sm px-4 py-2 hover:text-blue-500 hover:bg-white mt-4 lg:mt-0">
              <span>{ login }</span>
            </a>
          </div>
          }
          <div>
            <button href="#" className="flex items-center inline-block text-sm px-4 py-2 hover:text-blue-500 hover:bg-white mt-4 lg:mt-0" onClick={() => ToggleNavState('about')}>
              <span>About</span>
              <svg data-accordion-icon className={`w-6 h-6 shrink-0 ${navState.about ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" ></path></svg>
            </button>

          </div>
        </div>
      </nav>
      <section id="about" className={`${navState.about ? 'p-5 visible' : 'h-0 invisible'} border-solid border-2 border-gray-300`}>
        <p>
          jsPerf.app is an online JavaScript performance benchmark test runner &amp; jsperf.com mirror. It is a complete rewrite in homage to the once excellent jsperf.com now with hopefully a more modern &amp; maintainable <a href="https://github.com/rd13/jsperf.app">codebase</a>.
        </p>

        <p className="my-4">
          jsperf.com URLs are mirrored at the same path, e.g:
        </p>

        <pre className="bg-gray-100 inline-block">https://jsperf.com/negative-modulo/2</pre>

        <p className="my-4">Can be accessed at:</p>

        <pre className="bg-gray-100 inline-block">
          <Link href="https://jsperf.app/negative-modulo/2">
            https://jsperf.app/negative-modulo/2
          </Link>
        </pre>
      </section>
    </header>
  )
}
