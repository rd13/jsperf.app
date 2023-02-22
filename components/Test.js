import {highlightSanitizedJS} from '../utils/hljs'

export const Test = (props) => {
  const {title, code, status, hz, rme, fastest, slowest, percent, index} = props.test

  const result = {
    default: (<div>ready</div>),
    running: (<div>running...</div>),
    pending: (<div>pending...</div>),
    completed: (<div>completed</div>),
    finished: (
      <>
        <p>{hz}</p>
        <small className="block">&plusmn;{rme}%</small>
        <p>{fastest ? 'fastest' : `${percent}% slower`}</p>
      </>
    )
  }
  return (
    <tr className="">
      <td className="py-5 px-2 bg-gray-200 w-1/6 border border-slate-300">
        <div className="flex relative w-500px h-48px group justify-center items-center z-1001">
          <input type="text" className="p-2 bg-transparent border-b-2 hover:border-blue-500 focus:outline-none focus:border-blue-500 border-gray-200" placeholder={`Test ${index + 1}`} />
          <span className="flex absolute right-0 bg-transparent rounded text-base text-gray-600 p-2">
            <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <title>edit</title>
              <style type="text/css">{`.fill-current { fill: #999; }`}</style>
              <path d="M16.77 8l1.94-2a1 1 0 0 0 0-1.41l-3.34-3.3a1 1 0 0 0-1.41 0L12 3.23zm-5.81-3.71L1 14.25V19h4.75l9.96-9.96-4.75-4.75z"/>
            </svg>
          </span>
        </div>
        {/* {title} */}
      </td>
      <td className="code px-2 border border-slate-300">
        <pre className="w-full whitespace-pre-wrap break-words">
          <code dangerouslySetInnerHTML={
            {__html: highlightSanitizedJS(code)}} />
        </pre>
      </td>
      <td className={`${status === 'finished' && fastest && 'bg-jsp-green'} ${status === 'finished' && slowest && 'bg-jsp-pink'} text-center w-[100px] p-2 border border-slate-300`}>{result[status] || result.default}</td>
    </tr>
  )
}

export const TestEditable = (props) => {
  const {test: {title, code, status, hz, rme, fastest, slowest, percent, id}, onTestChange} = props

  const result = {
    default: (<div>ready</div>),
    running: (<div>running...</div>),
    pending: (<div>pending...</div>),
    completed: (<div>completed</div>),
    finished: (
      <>
        <p>{hz}</p>
        <small className="block">&plusmn;{rme}%</small>
        <p>{fastest ? 'fastest' : `${percent}% slower`}</p>
      </>
    )
  }
  return (
    <tr className="">

      { /* Test Description Input */ }
      <td className="py-5 px-2 bg-gray-200 w-1/6 border border-slate-300">
        <div className="flex relative w-500px h-48px group justify-center items-center z-1001">

          <input type="text" className="p-2 bg-transparent border-b-2 hover:border-blue-500 focus:outline-none focus:border-blue-500 border-gray-200" placeholder={`Test ${id + 1}`} />
          <span className="flex absolute right-0 bg-transparent rounded text-base text-gray-600 p-2">
            <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <title>edit</title>
              <style type="text/css">{`.fill-current { fill: #999; }`}</style>
              <path d="M16.77 8l1.94-2a1 1 0 0 0 0-1.41l-3.34-3.3a1 1 0 0 0-1.41 0L12 3.23zm-5.81-3.71L1 14.25V19h4.75l9.96-9.96-4.75-4.75z"/>
            </svg>
          </span>
        </div>
        {title}
      </td>

      <td className="code px-2 border border-slate-300">
        <pre className="w-full whitespace-pre-wrap break-words">
          <code dangerouslySetInnerHTML={
            {__html: highlightSanitizedJS(code)}} />
        </pre>
      </td>

      <td className={`${status === 'finished' && fastest && 'bg-jsp-green'} ${status === 'finished' && slowest && 'bg-jsp-pink'} text-center w-[100px] p-2 border border-slate-300`}>{result[status] || result.default}</td>
    </tr>
  )
}
