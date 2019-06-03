import React from 'react'
import Loading from '../../../../components/UI/Loading/Loading'
import { render } from '@testing-library/react'

it('UI/Loading renders correctly', () => {
   const {container} = render(<Loading />)

   expect(container.firstChild).toMatchSnapshot()
})
