import React from 'react'
import Checkbox from '../../../components/UI/Checkbox'
import { render, fireEvent } from '@testing-library/react'

it('UI/Checkbox renders correctly', () => {
   const {container} = render(<Checkbox/>)

   expect(container.firstChild).toMatchSnapshot()
})

it('UI/Checkbox onChange function fired', () => {
    const onChange = jest.fn()
    const { container } = render(<Checkbox onChange={onChange}/>)
    const button = container.querySelector('.sd-checkbox')

    fireEvent.click(button)
    expect(onChange).toHaveBeenCalled()
 })
