import { useState, useEffect } from 'react'
import lodash from 'lodash'
import Benchmark from 'benchmark'
import PostMessageBroker from '../utils/postMessageBroker'
import {getRanked} from '../utils/ArrayUtils'

export default (props) => {
  const {pageData: {tests, initHTML, setup, teardown}} = props

  useEffect(() => {
    global.Benchmark = Benchmark

    const broker = new PostMessageBroker()

    // Component has been mounted and Benchmark / associated libs are ready
    broker.emit('ready', {})


    let ui = new Benchmark.Suite

    let uiBenchmarks = []

    // Benchmark.prototype.setup = setup
    // Benchmark.prototype.teardown = teardown

    const bindUiEvents = () => {
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
          }

          broker.emit('cycle', {
            id: this.id,
            name: this.name,
            count: Benchmark.formatNumber(this.count),
            size: this.stats.sample.length,
            status,
            running: ui.running
          })
        }, 200))
      })

      ui.on('complete', () => {
        const ranked = getRanked(uiBenchmarks)
        const fastest = ranked[0]
        const slowest = [...ranked].pop()

        const fastestHz = fastest?.hz

        // Select some fields to pass to render
        const results = uiBenchmarks.map(({id, hz, stats}) => {
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
            status: 'finished',
            percent: percentFormatted
          }
        })

        broker.emit('complete', {
          results
        })
      })
    }

    broker.register('run', ({data: { options, tests }}) => { 
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
        // ui.push.apply(ui, uiBenchmarks.filter((bench) => {
        //   return !bench.error && bench.reset()
        // }))

        // Create a new suite and start 
        ui = new Benchmark.Suite
        uiBenchmarks = []
        bindUiEvents()
        console.log('adding', tests)

        tests.forEach((test) => {
          ui.add(test.title,
            {
              defer: test.async,
              fn: test.code,
              id: test.id
            }
          )
        })

        ui.run({
          'async': true,
          'queued': true
        }) 
      }
    })
  }, [])

  return (
    <div className="prepHTMLOutput" dangerouslySetInnerHTML={{__html: initHTML}}/>
  )
}
