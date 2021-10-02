const Revisions = (props) => {
  const {revisions} = props
  return (
    <>
      <h2>Revisions</h2>
      <ul>
        {revisions.map((revision, index) => 
          (
            <li key={index}>
              <a href="">Revision {revision.revision}</a>: published on <time dateTime={revision.published}>
                {new Date(revision.published).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
            </li>
          )
        )}
      </ul>
    </>
  )
}

export default Revisions
