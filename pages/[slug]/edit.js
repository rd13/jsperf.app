// Redirect from {slug}/edit to {slug}/1/edit

export default function Edit({slug}) {}

export function getServerSideProps({params}) {
  const { slug } = params

  return {
    redirect: {
      destination: `/${slug}/1/edit`
    }
  }
}

