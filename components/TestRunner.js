import SandboxIframe from '../components/SandboxIframe'
import PostMessageBroker from '../utils/postMessageBroker'
import { useState, useEffect, useRef } from 'react'
import styles from './TestRunner.module.css'
import UserAgent from './UserAgent'
import {Test, TestEditable} from './Test'
import buttonStyles from '../styles/buttons.module.css'

export default function Tests(props) {
  const {editable, onTestChange} = props

  // A textual status message
  const [statusMessage, setStatusMessage] = useState('')

  // The sandbox will send a postMessage when Benchmark is ready to run
  const [benchStatus, setBenchStatus] = useState('notready')

  const [broker, setBroker] = useState(null)

  // Default tests, could be predefined if editing or empty [{id:0},{id:1}]
  const [tests, setTests] = useState(
    (props.tests && props.tests.map((test, id) => Object.assign(test, {id})))
    || [{id:0},{id:1}]
  )

  const runButtonText = {
    'default'  : 'Run',
    'ready'    : 'Run',
    'complete' : 'Run',
    'running'  : 'Stop'
  }

  // This is a ref to the sandbox iframe window used for communication
  const windowRef = useRef(null)

  useEffect(() => {
    // Setup communication with iframe
    const _broker = new PostMessageBroker(windowRef.current.contentWindow)

    setBroker(_broker)

    _broker.register('cycle', event => {
      const {id, name, count, size, status} = event.data

      if (!['finished', 'completed'].includes(status)) {
        setStatusMessage(`${name} × ${count} (${size} sample${size === 1 ? '' : 's'})`)
      }

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

  const sandboxUrl = `/sandbox/${props.id}`

  const run = (options) => {
    broker.emit('run', {options, tests})

    setTests(tests => {
      // Transition all tests status to pending
      for (let test of tests) {
        test.status = 'pending'
      }
      return tests
    })

    setBenchStatus('running')
  }

  const addTest = () => {
    setTests(tests => {
      return [...tests, {
        title: '', code: '', 'async': false
      }]
    })
  }

  return (
    <>
      <h2 className="font-bold my-5">Test runner</h2>
      <div id="controls" className="flex my-5 items-center">
        <p id="status" className="flex-1">{statusMessage}</p>
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
        { benchStatus === 'running' &&
          <button 
            type="button"
            className={buttonStyles.default}
            onClick={() => run()}>Stop</button>
        }
        <iframe 
          src={sandboxUrl} 
          ref={windowRef} 
          sandbox="allow-scripts" 
          className="hidden"></iframe>
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
          {tests.map((test, index) => 
            (
              editable 
              ? <TestEditable key={test.id} test={{...test, index}} onTestChange={onTestChange} />
              : <Test key={index} test={{...test, index}} />
            )
          )}
        </tbody>
        { editable &&
          <tfoot>
            <tr>
              <td><button onClick={addTest}>Add another test</button></td>
            </tr>
          </tfoot>
        }
      </table>
    </>
  )
}
