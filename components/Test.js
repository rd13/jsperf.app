import { highlightSanitizedJS } from '@/utils/hljs'

export default function Test(props) {
  const {benchStatus, test: {title, code, error, status, hz, rme, fastest, slowest, percent}} = props

  const result = {
    default: (<div>ready</div>),
    running: (<div>running...</div>),
    pending: (<div>pending...</div>),
    completed: (<div>completed</div>),
    error: (<div>ERROR</div>),
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
        {title}
      </td>
      <td className="code px-2 border border-slate-300">
        <pre className="w-full whitespace-pre-wrap break-words">
          <code dangerouslySetInnerHTML={
            {__html: highlightSanitizedJS(code)}} />
        </pre>
      </td>
      <td className={`${(status === 'finished' && fastest) ? 'bg-jsp-green' : ''} ${(status === 'finished' && slowest) ? 'bg-jsp-pink' : ''} ${(status === 'error') ? 'font-bold bg-jsp-pink text-red-600' : ''} text-center w-[100px] p-2 border border-slate-300`}>{'ready' === benchStatus ? result.default : result[status]}</td>
    </tr>
  )
}
