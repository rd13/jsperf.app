import React from 'react'
import PropTypes from 'prop-types'
import DocHead from './DocHead'
import Image from 'next/image'

function SvgIcon(props) {
  return (
    <svg
      id="prefix__Icons"
      viewBox="0 0 32 32"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <style>
        {
          ".prefix__st0{fill:white;stroke:black;opacity:30%;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}"
        }
      </style>
      <path className="prefix__st0" d="M4 9.7v13.5L16 30l12-6.8V9.7L16 3z" />
      <path className="prefix__st0" d="M4 10.2L16 17l12-6.8M16 30V17" />
    </svg>
  )
}

const Layout = (props) => {
  const {children} = props
  return (
    <>
      <DocHead {...props} />
      <nav id="header" className="w-full z-30 text-black bg-white">
        <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-0">
        <div className="">
          <a className="font-bold text-2xl lg:text-2xl" href="#">
            <SvgIcon className="inline mr-2" fill="#ffffff" width="40" height="40" />
              <span className="align-middle">faction3D</span>
          </a>
        </div>
          <div className="block lg:hidden pr-4">
            <button id="nav-toggle" className="flex items-center p-1 text-pink-800 hover:text-gray-900 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">
              <svg className="fill-current h-6 w-6" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
            </button>
          </div>
          <div className="w-full flex-grow lg:flex lg:items-center lg:w-auto hidden mt-2 lg:mt-0 bg-white lg:bg-transparent text-black p-4 lg:p-0 z-20" id="nav-content">
            <ul className="list-reset lg:flex justify-end flex-1 items-center">
              <li className="mr-3">
                <a className="inline-block text-sm text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4" href="#">Sign in</a>
              </li>
            </ul>
            <button
              id="navAction"
              className="mx-auto lg:mx-0 hover:underline bg-white text-gray-800 font-bold mt-4 lg:mt-0 py-4 px-8 shadow opacity-75 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
              >
            Basket (0)
            </button>
          </div>
        </div>
        <hr className="border-b border-gray300 my-0 py-0" />
        {/* <hr className="border-b border-lime-400 my-0 py-0" /> */}
      </nav>
      { children }
      <footer className="p-4 bg-gray-100">Footer</footer>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export const config = { amp: true }
export default Layout
