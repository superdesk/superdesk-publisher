import React from 'react'
import {ToggleBox} from '../../../components/UI/ToggleBox'
import { render, fireEvent } from '@testing-library/react'

it('UI/ToggleBox renders correctly', () => {
   const {container} = render(<ToggleBox title="test" />)

   expect(container.firstChild).toMatchSnapshot()
})
