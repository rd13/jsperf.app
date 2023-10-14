import MessageBus from '../../utils/MessageBus'
import { useState, useEffect, useRef } from 'react'
import styles from './TestRunner.module.css'
import UserAgent from '../UserAgent'
import Test from '../Test'
import buttonStyles from '../../styles/buttons.module.css'
import UI from '../UI'

export default function Tests(props) {
  const {id} = props

  const broker = MessageBus.broker('testRunner')

  const [statusMessage, setStatusMessage] = useState('')

  const [benchStatus, setBenchStatus] = useState('notready')

  const [tests, setTests] = useState(props.tests)

  const runButtonText = {
    'default'  : 'Run',
    'ready'    : 'Run',
    'complete' : 'Run',
    'running'  : 'Stop'
  }

  broker.on('ready', () => {
    setStatusMessage('Ready to run.')
    setBenchStatus('ready')
  })

  broker.on('cycle', event => {
    const {id, name, count, size, status} = event

    if (!['finished', 'completed'].includes(status)) {
      setStatusMessage(`${name} × ${count} (${size} sample${size === 1 ? '' : 's'})`)
    }

    setTests(tests => {
      tests[id].status = status
      return tests
    })
  })

  broker.on('complete', ({ results }) => {
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

  const run = (options) => {
    broker.emit('run', {options})

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

        <UI broker={broker} pageData={{tests: props.tests, initHTML: props.initHTML, setup: props.setup, teardown: props.teardown}} />

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
            <Test key={i} test={test} />
          )}
        </tbody>
      </table>
    </>
  )
}

export async function getServerSideProps({params, res}) {
  console.log('test runner server side props')
}
