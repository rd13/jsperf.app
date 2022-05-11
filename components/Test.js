import {highlightSanitizedJS} from '../utils/hljs'

export default function Test(props) {
  const {title, code, status, hz, rme, fastest, slowest, percent} = props.test

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
      <th className="py-5 bg-gray-200">
        {title}
      </th>
      <td className="code px-2 w-full">
        <pre className="w-full whitespace-pre-wrap break-words">
          <code dangerouslySetInnerHTML={
            {__html: highlightSanitizedJS(code)}} />
        </pre>
      </td>
      <td className={`${fastest && 'bg-jsp-green'} ${slowest && 'bg-jsp-pink'} text-center w-[100px] p-2`}>{result[status] || result.default}</td>
    </tr>
  )
}
