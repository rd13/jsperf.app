"use client"

import 'highlight.js/styles/github.css'
import '@/styles/globals.css'
import '@/styles/markdown.css'

import { GoogleAnalytics } from '@next/third-parties/google'
import { SessionProvider } from "next-auth/react"
import Script from 'next/script'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Layout(props) {
  const {children, navState} = props
  return (
    <>
      <SessionProvider>
        <div className="font-sans antialiased min-h-full flex flex-col bg-gray-100">
          <div className="flex-auto ">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 bg-white min-h-screen">
              <Header navState={navState} />
              { children }
              <Footer />
            </div>
          </div>
        </div>
      </SessionProvider>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
    </>
  )
}
