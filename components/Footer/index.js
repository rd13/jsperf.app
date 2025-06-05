"use client"

import { signOut, useSession } from "@/app/lib/auth-client"
import styles from './Footer.module.css'
import Link from 'next/link'

export default function Footer() {
  const { data: session, status } = useSession()

  return (
      <footer className={styles.footer}>
        <div className="mx-auto w-full max-w-screen-xl">
          <div className="grid grid-cols-2 gap-8 px-4 py-6 lg:py-8 md:grid-cols-4">
            <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">jsPerf</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  <li className="mb-4">
                    <Link href="/" className="no-underline">
                      New Benchmark
                    </Link>
                  </li>
                </ul>
            </div>

            <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Resources</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  <li className="mb-4">
                    <Link href="/latest" className="no-underline">
                      Latest
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link href="/examples" className="no-underline">
                      Examples
                    </Link>
                  </li>
                </ul>
            </div>

            <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">External</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  <li className="mb-4">
                    <Link href="https://github.com/rd13/jsperf.app" className="no-underline">
                      GitHub
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link href="https://github.com/rd13/jsperf.app/issues" className="no-underline">
                      Report Issue
                    </Link>
                  </li>
                </ul>
            </div>

            { 
              session &&
                <div>
                  <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">User</h2>
                  <ul className="text-gray-500 dark:text-gray-400 font-medium">
                    <li className="mb-4">
                      <a href="#" className="inline-block leading-none mt-4 lg:mt-0" onClick={() => signOut()}>Sign Out</a>
                    </li>
                  </ul>
                </div>
            }
          </div>
        </div>
      </footer>
  )
}
