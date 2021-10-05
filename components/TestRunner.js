import SandboxIframe from '../components/SandboxIframe'
import PostMessageBroker from '../utils/postMessageBroker'
import { useState, useEffect, useRef } from 'react'
import styles from './TestRunner.module.css'
import UserAgent from './userAgent'
import Test from './Test'
import buttonStyles from '../styles/buttons.module.css'

export default function Tests(props) {
  const {id} = props

  // A textual status message
  const [statusMessage, setStatusMessage] = useState('')

  // The sandbox will send a postMessage when Benchmark is ready to run
  const [benchStatus, setBenchStatus] = useState('notready')

  const [broker, setBroker] = useState(null)

  const [tests, setTests] = useState(props.tests)

  const runButtonText = {
    'default'  : 'Run',
    'ready'    : 'Run',
    'complete' : 'Run again',
    'running'  : 'Stop running'
  }

  // This is a ref to the sandbox iframe window used for communication
  const windowRef = useRef(null)

  useEffect(() => {
    // Setup communication with iframe
    const _broker = new PostMessageBroker(windowRef.current.contentWindow)

    setBroker(_broker)

    _broker.register('cycle', event => {
      const {id, name, count, size, status} = event.data
      setStatusMessage(`${name} × ${count} (${size} sample${size === 1 ? '' : 's'})`)

      // Note to self: treat state arrays as immutable, instead provide setState with a function to update
      // This is probably not optimal. Instead only update test status on status transition.
      // Or, if there is no mutation is this intelligent enough not to trigger a re-render?
      // Also to note: this is throttled
      setTests(tests => {
        tests[id].status = status
        return tests
      })
    })

    _broker.register('complete', event => {
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
    _broker.register('ready', () => {
      setStatusMessage('Ready to run.')
      setBenchStatus('ready')
    })
  }, [])

  const sandboxUrl = `http://localhost:3000/sandbox/${id}`

  const run = () => {
    broker.emit('run')

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
      <h2>Test runner</h2>
      <p id="status">{statusMessage}</p>
      <div id="controls" className="show">
        <button 
          id="run" 
          type="button" 
          disabled={benchStatus === 'notready'}
          className={buttonStyles.default} 
          onClick={() => run()}>{runButtonText[benchStatus]||runButtonText['default']}</button>
        <iframe 
          src={sandboxUrl} 
          ref={windowRef} 
          sandbox="allow-scripts" 
          className={styles.sandboxIframe}></iframe>
      </div>
      <table id="test-table">
        <caption>Testing in <UserAgent /></caption>
        <thead>
          <tr>
            <th colSpan="2">Test</th>
            <th title="Operations per second (higher is better)">Ops/sec</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test, i) => 
            <Test key={i} test={test} />
          )}
        </tbody>
      </table>
    </>
  )
}
