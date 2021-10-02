import { useRouter } from 'next/router'
export default function Edit(props) {
  const router = useRouter()
  const { slug, revision } = router.query

  return (
    <h1>Edit: {slug} - {revision}</h1>
  )
}
