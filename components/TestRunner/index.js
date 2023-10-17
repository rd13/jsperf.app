import { useState, useEffect, useRef } from 'react'
import UserAgent from '../UserAgent'
import Test from '../Test'
import buttonStyles from '../../styles/buttons.module.css'

import lodash from 'lodash'
import {getRanked} from '../../utils/ArrayUtils'

import '../../lib/benchmark.mjs' // mjs to avoid webpack parser

const Benchmark = global.Benchmark

export default function Tests(props) {
  const {initHTML} = props

  const [statusMessage, setStatusMessage] = useState('Ready to run.')

  const [benchStatus, setBenchStatus] = useState('ready')

  const [tests, setTests] = useState(props.tests)

  const runButtonText = {
    'default'  : 'Run',
    'ready'    : 'Run',
    'complete' : 'Run',
    'running'  : 'Stop'
  }

  let uiBenchmarks = []

  const newTestRun = () => {
    const ui = new Benchmark.Suite()

    Benchmark.prototype.setup = props.setup
    Benchmark.prototype.teardown = props.teardown

    ui.on('add', event => {
      let status = 'default'

      uiBenchmarks.push(event.target)

      event.target.on('start cycle complete', _.throttle(function(event) {
        if (this.running) {
          status = 'running'
        } else if (this.cycles) {
          if (ui.running) {
            status = 'completed'
          } else {
            status = 'finished'
          }
        } else if (event.target.error) {
          status = 'error'
          console.log(props.pageData)
          console.log(event.target.error)
        }

        console.log(this.id)

        if (!['finished', 'completed'].includes(status)) {
          setStatusMessage(`${this.name} × ${Benchmark.formatNumber(this.count)} (${this.stats.sample.length} sample${this.stats.sample.length === 1 ? '' : 's'})`)
        }

        const testID = this.id

        setTests(tests => {
          console.log(tests)
          tests[testID].status = status
          return tests
        })
      }, 200))
    })

    tests.forEach((test, id) => {
      console.log('adding test to ui', test)
      ui.add(test.title,
        {
          defer: test.async,
          fn: test.code,
          id
        }
      )
    })

    ui.on('complete', () => {
      const ranked = getRanked(uiBenchmarks)
      const fastest = ranked[0]
      const slowest = [...ranked].pop()

      const fastestHz = fastest?.hz

      // Select some fields to pass to render
      const results = uiBenchmarks.map(({id, hz, stats, error}) => {
        const perc = (1 - (hz / fastestHz)) * 100
        const percentFormatted = Benchmark.formatNumber(
          perc < 1 
          ? perc.toFixed(2) 
          : Math.round(perc)
        )

        return {
          id, 
          hz: Benchmark.formatNumber(hz.toFixed(hz < 100 ? 2 : 0)), 
          rme: stats.rme.toFixed(2),
          fastest: id === fastest?.id, 
          slowest: id === slowest?.id, 
          status: error ? 'error' : 'finished',
          error,
          percent: percentFormatted
        }
      })

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

    return ui
  }

  const run = (options) => {
    const ui = newTestRun()

    // options can override each benchmark defaults, e.g. maxTime
    if (options) {
      for (let benchmark of uiBenchmarks) {
        Object.assign(benchmark.options, options)
        benchmark.reset()
      }
    }

    const stopped = !ui.running

    ui.abort()
    ui.length = 0

    if (stopped) {
      ui.push.apply(ui, uiBenchmarks.filter((bench) => {
        return !bench.error && bench.reset()
      }))

      ui.run({
        'async': true,
        'queued': true
      }) 
    }

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

        <div className="prepHTMLOutput hidden" dangerouslySetInnerHTML={{__html: initHTML}}/>

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
