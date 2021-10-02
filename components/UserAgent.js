import { useState, useEffect } from 'react'
import UAParser from 'ua-parser-js'

const UserAgent = () => {
  const [userAgent, setUserAgent] = useState(null)

  useEffect(() => {
    try { // Don't trust 3rd party parsers
      const parser = new UAParser()
      const ua = `${parser.getBrowser().name} ${parser.getBrowser().version} in ${parser.getOS().name}`
      setUserAgent(ua)
    } catch (e) {
      setUserAgent(window.navigator.userAgent) // Should probably truncate this
    }
  }, []);

  return userAgent
};
export default UserAgent
