import { signOut, useSession } from "next-auth/react"

export default function Header() {
  const { data: session, status } = useSession()

  const { login } = session?.user?.profile || {}

  return (
    <header>
      { 
        session &&
          <i className="block text-right">Logged in as: { login }</i>
      }
    </header>
  )
}
