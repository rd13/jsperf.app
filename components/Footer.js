import { signOut, useSession } from "next-auth/react"
import buttonStyles from '../styles/buttons.module.css'
import styles from './Footer.module.css'

export default function Footer() {
  const { data: session, status } = useSession()

  return (
      <footer className={styles.footer}>
        <ul>
          <li>
            <a href="/">Add Test</a>
          </li>
          <li>
            <a href="https://github.com/rd13/jsperf.app">GitHub</a>
          </li>
          { session &&
              <li>
                Logged in as: {session.user.name}
                <button onClick={() => signOut()} className={buttonStyles.default}>Sign out</button>
              </li>
          }
        </ul>
      </footer>
  )
}
