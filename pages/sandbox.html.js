import Head from 'next/head'
import UI from '../components/UI'

export default function Sandbox(props) {
  return (
    <>
      <Head>
        <meta 
          key="robots" 
          name="robots" 
          content="noindex,follow" 
        />
      </Head>
      <UI />
    </>
  )
}

