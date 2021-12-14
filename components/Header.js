import { signOut, useSession } from "next-auth/react"

export default function Header() {
  const { data: session, status } = useSession()

  return (
    <header>
      { 
        session &&
          <>
            <i>Logged in as: {session.user.profile.login}</i>
            <button onClick={() => signOut()}>Sign out</button>
          </>
      }
    </header>
  )
}
