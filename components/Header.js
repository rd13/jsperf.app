import { signOut, useSession } from "next-auth/react"
import Link from 'next/link'

export default function Header() {
  const { data: session, status } = useSession()

  const { login } = session?.user?.profile || {}

  return (
    <header>
      <Link href="/">
        <a>
          <h3 className="text-white font-bold bg-blue-500 px-5 py-3 text-xl inline-block">jsPerf.app</h3>
        </a>
      </Link>      
      { 
        session &&
          <i className="block text-right">Logged in as: { login }</i>
      }
    </header>
  )
}
