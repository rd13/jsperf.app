import { signOut, useSession } from "next-auth/react"
import buttonStyles from '../styles/buttons.module.css'
import styles from './Footer.module.css'

export default function Footer() {
  const { data: session, status } = useSession()

  return (
      <footer className={styles.footer}>
        <div className="container flex flex-wrap items-center justify-center px-4 py-8 mx-auto  lg:justify-between"
        >
          <div className="flex flex-wrap justify-center">
            <ul className="flex items-center space-x-4">
              <li><a href="/">Add Test</a></li>
              <li><a href="https://github.com/rd13/jsperf.app">GitHub</a></li>
              <li><button onClick={() => signOut()}>Sign out</button></li>
            </ul>
          </div>
        </div>
      </footer>
  )
}
