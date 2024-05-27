import Title from '@/components/sections/Title'

import TestRunner from '@/components/TestRunner'
import {Accordian, AccordianItem} from '@/components/Accordian'

export default async function UI(props) {
  const { editable } = props

  const pageData = {
    initHTML: '',
    setup: '',
    teardown: '',
    tests: [
      { title: 'Underscore Flatten', code: 'const a = 234' },
      { title: 'Native Flatten', code: 'const a = 345435' }
    ]
  }

  return (
    <>
      <section>
        <Title editable={editable} pageData={pageData} />
        <input type="text" className="w-full text-md px-2 my-1" placeholder="Description (optional)" />
        <Accordian>
          <AccordianItem title="Setup HTML">
          </AccordianItem>

          <AccordianItem title="Setup Javascript">
          </AccordianItem>
        </Accordian>

        <TestRunner tests={pageData.tests} initHTML={pageData.initHTML} setup={pageData.setup} teardown={pageData.teardown} />

        <Accordian>
          <AccordianItem title="Teardown">
          </AccordianItem>
        </Accordian>
      </section>
    </>
  )
}
