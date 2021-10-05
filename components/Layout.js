import React from 'react'
import DocHead from './DocHead'

const Layout = (props) => {
  const {children} = props
  return (
    <>
      <DocHead {...props} />
      { children }
      <footer className="">
        <a href="">Add Test</a>
        <a href="https://github.com/rd13/jsperf.app">GitHub</a>
      </footer>
    </>
  )
}

export default Layout
