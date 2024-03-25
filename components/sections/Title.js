export default function Title(props) {
  const {title, setTitle} = props

  return (
    <>
      <input type="text" placeholder="Test title" className="text-2xl appearance-none bg-transparent border-none w-full font-bold text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" defaultValue={title} onChange={event => setTitle(event.target.value)}  />
    </>
  )
}
