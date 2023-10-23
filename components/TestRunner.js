import SandboxIframe from '../components/SandboxIframe'
import PostMessageBroker from '../utils/postMessageBroker'
import { useState, useEffect, useRef } from 'react'
import styles from './TestRunner.module.css'
import UserAgent from './UserAgent'
import Test from './Test'
import buttonStyles from '../styles/buttons.module.css'

export default function Tests(props) {
  const {id} = props

  // A textual status message
  const [statusMessage, setStatusMessage] = useState('')

  // The sandbox will send a postMessage when Benchmark is ready to run
  const [benchStatus, setBenchStatus] = useState('notready')

  const [broker, setBroker] = useState()

  const [tests, setTests] = useState(props.tests)
  const [initHTML, setInitHTML] = useState(props.initHTML)
  const [setup, setSetup] = useState(props.setup)
  const [teardown, setTeardown] = useState(props.teardown)

  const runButtonText = {
    'default'  : 'Run',
    'ready'    : 'Run',
    'complete' : 'Run',
    'running'  : 'Stop'
  }

  // This is a ref to the sandbox iframe used for communication
  const sandboxRef = useRef()

  useEffect(() => {
    // Setup communication with iframe
    setBroker(new PostMessageBroker(sandboxRef.current.contentWindow))
  }, [])

  useEffect(() => {
    if (!broker) return // communication with sandbox not yet established

    // These broker events should bind only once on broker initialisation
    broker.on('cycle', event => {
      const {id, name, count, size, status, running} = event.data

      if (!['finished', 'completed'].includes(status)) {
        setStatusMessage(`${name} × ${count} (${size} sample${size === 1 ? '' : 's'})`)
      }

      setTests(tests => {
        tests[id].status = status
        return tests
      })
    })

    broker.on('complete', event => {
      const {results} = event.data

      setTests(prevTests => {
        for(let result of results) {
          // Merge each test with result
          prevTests[result.id] = {
            ...prevTests[result.id],
            ...result
          }
        }
        return prevTests
      })
      setStatusMessage('Done. Ready to run again.')
      setBenchStatus('complete')
    })

    // The sandbox is ready to run a test
    broker.on('ready', () => {
      setBenchStatus('ready')
    })
  }, [broker])

  const stop = () => {
    broker.emit('stop')
    setBenchStatus('ready')
  }

  const run = (options) => {
    broker.emit('run', {
      options,
      tests,
      initHTML,
      setup,
      teardown
    })

    setTests(tests => {
      // Transition all tests status to pending
      for (let test of tests) {
        test.status = 'pending'
      }
      return tests
    })

    setBenchStatus('running')
  }

  return (
    <>
      <h2 className="font-bold my-5">Test runner</h2>
      <div id="controls" className="flex my-5 h-16 items-center">
        <p id="status" className="flex-1">
          {
            'ready' === benchStatus 
              ? 'Ready to run.' 
              : statusMessage
          }
        </p>
        { ['ready', 'complete'].includes(benchStatus) &&
          <>
            <button 
              id="run" 
              type="button" 
              disabled={benchStatus === 'notready'}
              className={`${buttonStyles.default} mx-2`} 
              onClick={() => run({maxTime: 5})}>{runButtonText[benchStatus]||runButtonText['default']}</button>
            <button
              type="button" 
              disabled={benchStatus === 'notready'}
              className={buttonStyles.default}
              onClick={() => run({maxTime: 0.5})}>Quick Run</button>
            </>
        }
        { 'running' === benchStatus &&
          <button 
            type="button"
            className={buttonStyles.default}
            onClick={() => stop()}>Stop</button>
        }
        <iframe 
          src="/sandbox.html"
          ref={sandboxRef} 
          sandbox="allow-scripts"
          style={{height: "1px", width: "1px"}}></iframe>
      </div>
      <table id="test-table" className="w-full border-collapse">
        <caption className="bg-gray-200 font-bold text-md text-gray-800">Testing in <UserAgent /></caption>
        <thead className="bg-blue-500 text-white">
          <tr>
            <th colSpan="2" className="py-1">Test</th>
            <th title="Operations per second (higher is better)" className="px-2">Ops/sec</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test, i) => 
            <Test key={i} test={test} benchStatus={benchStatus} />
          )}
        </tbody>
      </table>
    </>
  )
}
