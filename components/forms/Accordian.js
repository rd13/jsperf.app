import accordianStyles from '../../styles/accordian.module.css'

export const Accordian = ({children}) => {
  return (
    <div className={`${accordianStyles.default} mx-auto w-full`}>
      {children}
    </div>
  )
}

export const AccordianItem = (props) => {
  const {children, title, open} = props
  return (
    <details className="bg-white open:bg-gray-100 duration-300 my-6 drop-shadow" open={!!open}>
      <summary className="bg-inherit px-5 py-3 text-lg flex cursor-pointer">
        {title}
        <button className="ml-auto" type="button">
          <svg className="fill-current opacity-75 w-4 h-4 -mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"/></svg>
        </button>
      </summary>
      <div className="bg-white px-5 py-3 text-sm font-light flex">
        {children}
      </div>
    </details>
  )
}
