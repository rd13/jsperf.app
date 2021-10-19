import { signOut, useSession } from "next-auth/react"

export default function Footer() {
  const { data: session, status } = useSession()

  return (
      <footer className="">
        <a href="/">Add Test</a>
        <a href="https://github.com/rd13/jsperf.app">GitHub</a>
      </footer>
  )
}
