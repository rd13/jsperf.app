"use client"

import 'highlight.js/styles/github.css'
import '@/styles/globals.css'

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
        <div className="font-sans antialiased min-h-full flex flex-col bg-gray-50">
          <div className="flex-auto ">
            <Header navState={navState} />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen bg-white">
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
