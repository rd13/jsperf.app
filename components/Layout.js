import React from 'react'
import DocHead from './DocHead'
import Header from './Header'
import Footer from './Footer'

export default function Layout(props) {
  const {children, navState} = props
  return (
    <>
      <DocHead {...props} />
      <div className="font-sans antialiased min-h-full flex flex-col bg-gray-100">
        <div className="flex-auto ">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 bg-white min-h-screen">
            <Header navState={navState} />
            { children }
            <Footer />
          </div>
        </div>
      </div>
    </>
  )
}
