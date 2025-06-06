"use client"

import buttonStyles from '@/styles/buttons.module.css'
import styles from './PublishButton.module.css'
import { useRouter } from 'next/navigation'
import UUID from '../../UUID'
import { useSession } from "@/app/lib/auth-client"

export default function PublishButton({ slug, revision, uuid, githubID }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  const userID = UUID()

  let canEdit = false

  if (githubID && session?.user?.profile?.id) {
    if (session?.user?.profile?.id === githubID) {
      canEdit = true
    }
  } 

  if (uuid === userID) {
    canEdit = true
  }

  const publish = async (event) => {
    event.preventDefault();

    const response = await fetch('/api/page', {
      method: 'PUT',
      body: JSON.stringify({
        slug, revision, uuid,
        visible: true
      }),
    })

    const {success} = await response.json()

    if (success) {
      router.push(`/${slug}/${revision}`)
    }
  }

  return (
    <>
      <a href={`/${slug}/${revision}/edit`} className={buttonStyles.default}>Edit Tests</a><span className="inline-flex items-center px-2"> - or - </span>
      <a onClick={publish} href="#" className={styles.PublishButton}>Publish</a> 
    </>
  )

}
