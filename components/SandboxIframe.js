// The content of the iframe which includes an API to interact with Benchmark.js

export default function SandboxIframe(props) {
  const {id} = props
  const sandboxUrl = `/sandbox/${id}`
  return (
    <iframe src={sandboxUrl} sandbox="allow-scripts"></iframe>
  )
}
