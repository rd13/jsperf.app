"use client"

import { useState, useEffect, useRef } from 'react'
import lodash from 'lodash'
import PostMessageBroker from '@/utils/postMessageBroker'
import { getRanked } from '@/utils/Array'

import '@/app/lib/benchmark.mjs' // mjs to avoid webpack parser

let modulePromises = {}

export default function Sandbox(props) {
  const Benchmark = global.Benchmark

  const initHTMLPlaceholder = useRef()

  useEffect(() => {
    window.resolveScriptModuleById = id => {
      modulePromises[id] && modulePromises[id]()
    }
  }, [])

  useEffect(() => {
    const broker = new PostMessageBroker()

    broker.on('run', async ({data: {options, tests, initHTML, setup, teardown}}) => {
      console.log('[sandbox] new test run', tests)

      if (initHTML) {
        // Inject HTML
        initHTMLPlaceholder.current.innerHTML = initHTML

        // Resolve scripts synchronously
        const scriptNodes = initHTMLPlaceholder.current.querySelectorAll("script")

        for (const scriptNode of scriptNodes) {
          await injectScriptNodeToHead(scriptNode, document)
        }
      }

      console.log('[sandbox] setup complete')

      const ui = new Benchmark.Suite

      Benchmark.prototype.setup = setup
      Benchmark.prototype.teardown = teardown

      const uiBenchmarks = []

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
            console.log(event.target.error)
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

      tests.forEach((test, id) => {
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

        broker.emit('complete', {
          results
        })
      })

      broker.on('stop', () => {
        ui.off()
        ui.abort()
        ui.length = 0
      })

      if (options) {
        for (let benchmark of uiBenchmarks) {
          Object.assign(benchmark.options, options)
          benchmark.reset()
        }
      }

      ui.run({
        'async': true,
        'queued': true
      }) 
    })

  }, [Benchmark])

  return (
    <>
      <div ref={initHTMLPlaceholder}></div>
    </>
  )
}

function injectScriptNodeToHead(script, document) {
  return new Promise((resolve, reject) => {
    const node = document.createElement('script')

    // if script type is a module, inject a callback function
    if (script.type === 'module') {
      const id = Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
      modulePromises[id] = resolve
      script.text = `${script.text} ;window.resolveScriptModuleById("${id}")`
    }

    if (script.type) {
      node.type = script.type
    }

    if (script.src) {
      node.src = script.src
      node.onload = resolve
      node.onerror = reject
    } else {
      node.text = script.text
    }

    document.head.appendChild(node)
    script.remove()

    return script.src || script.type || resolve(!0)
  }).then(() => {
    console.log('[sandbox] script injected', script.src || script.type || script.text.substr(0, 10))
  })
}
