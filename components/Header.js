import { signOut, useSession } from "next-auth/react"

export default function Header() {
  const { data: session, status } = useSession()

  return (
    <header>
      { session &&
        <>
          <span>Logged in as: {session.user.name}</span>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      }
    </header>
  )
}
