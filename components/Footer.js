import { signOut, useSession } from "next-auth/react"
import buttonStyles from '../styles/buttons.module.css'

export default function Footer() {
  const { data: session, status } = useSession()

  return (
      <footer>
        <ul>
          <li>
            <a href="/">Add Test</a>
          </li>
          <li>
            <a href="https://github.com/rd13/jsperf.app">GitHub</a>
          </li>
          { session &&
              <li className="right">
                Logged in as: {session.user.name}
              </li>
          }
        </ul>
      </footer>
  )
}
