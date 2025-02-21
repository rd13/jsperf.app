export default function Title(props) {
  const { editable, title} = props

  if (editable) {
    return (
      <input type="text" name="title" className="w-full text-2xl border-b border-gray-300 p-2" placeholder="Benchmark Title (optional)" defaultValue={title} />
    )
  }

  return (
    <>
      <hgroup>
        <h1 className="text-2xl py-6 font-bold">{pageData.title}<span className="text-gray-400 text-base">{`${pageData.revision > 1 ? ` (v${pageData.revision})` : ''}`}</span></h1>
      </hgroup>
    </>
  )
}
