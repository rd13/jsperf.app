import { signIn, signOut, useSession } from "next-auth/react"
import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const { data: session, status } = useSession()

  const [navState, setNavState] = useState({ "about": false });

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
            <span class="font-semibold text-2xl tracking-tight">jsPerf.app</span>
          </a>
        </div>
        <div class="block lg:hidden">
          <button class="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
            <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
          </button>
        </div>
        <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
          <div class="text-sm lg:flex-grow">
            <a href="#responsive-header" class="block mt-4 lg:inline-block lg:mt-0 text-gray-400 hover:text-white mr-4">
              &nbsp;
            </a>
          </div>
          { !session &&
          <div>
            <button href="#" class="flex items-center inline-block text-sm px-4 py-2 hover:text-blue-500 hover:bg-white mt-4 lg:mt-0" onClick={() => signIn("github")}>
              <span>Sign In</span>
            </button>
          </div>
          }
          <div>
            <button href="#" class="flex items-center inline-block text-sm px-4 py-2 hover:text-blue-500 hover:bg-white mt-4 lg:mt-0" onClick={() => ToggleNavState('about')}>
              <span>About</span>
              <svg data-accordion-icon className={`w-6 h-6 shrink-0 ${navState.about ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" ></path></svg>
            </button>

          </div>
        </div>
      </nav>
      { 
        session &&
          <i className="block text-right">Logged in as: { login }</i>
      }
      <section id="about" className={`${navState.about ? 'p-5 visible' : 'h-0 invisible'} border-solid border-2 border-gray-300`}>
        <p>
          jsPerf.app is an online JavaScript performance playground &amp; jsperf.com mirror. It is a complete rewrite in homage to the once excellent jsperf.com now with hopefully a more modern &amp; maintainable <a href="https://github.com/rd13/jsperf.app">codebase</a>.
        </p>

        <p className="my-4">
          jsperf.com URLs are mirrored at the same path, e.g:
        </p>

        <pre>https://jsperf.com/negative-modulo/2</pre>

        <p className="my-4">Can be accessed at:</p>

        <pre>
          <Link href="/negative-modulo/2">
            <a>https://jsperf.app/negative-modulo/2</a>
          </Link>
        </pre>
      </section>
    </header>
  )
}
