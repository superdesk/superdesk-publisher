import React from 'react'
import ButtonWide from '../../../components/UI/ButtonWide'
import { render, fireEvent } from '@testing-library/react'

it('UI/ButtonWide renders correctly', () => {
   const {container} = render(<ButtonWide label="Label"/>)

   expect(container.firstChild).toMatchSnapshot()
})

it('UI/ButtonWide onClick function fired', () => {
    const onClick = jest.fn()
    const { container } = render(<ButtonWide onClick={onClick} />)
    const button = container.querySelector('button')

    fireEvent.click(button)
    expect(onClick).toHaveBeenCalled()
 })
