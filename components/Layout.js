"use client"

import 'highlight.js/styles/github.css'
import '@/styles/globals.css'

import { SessionProvider } from "next-auth/react"
import * as gtag from '@/app/lib/gtag'
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

      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}
