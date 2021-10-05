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
        {hz}
        <small>&plusmn;{rme}%</small>
        <span>{fastest ? 'fastest' : `${percent}% slower`}</span>
      </>
    )
  }
  return (
    <tr>
      <th>
        <div>
          {title}
        </div>
      </th>
      <td className="code">
        <pre>
          <code dangerouslySetInnerHTML={
            {__html: highlightSanitizedJS(code)}} />
        </pre>
      </td>
      <td className={`results ${fastest && 'fastest'} ${slowest && 'slowest'}`}>{result[status]||result.default}</td>
    </tr>
  )
}
