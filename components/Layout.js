import React from 'react'
import DocHead from './DocHead'
import Header from './Header'
import Footer from './Footer'

const Layout = (props) => {
  const {children} = props
  return (
    <>
      <DocHead {...props} />
      <Header />
      { children }
      <Footer />
    </>
  )
}

export default Layout
