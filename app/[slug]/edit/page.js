import { redirect } from "next/navigation"

export default function Edit({ params }) {
  const { slug } = params
  redirect(`/${slug}/1/edit`)
}
