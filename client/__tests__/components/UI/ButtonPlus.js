import React from 'react'
import ButtonPlus from '../../../components/UI/ButtonPlus'
import { render, fireEvent } from '@testing-library/react'

it('UI/ButtonPlus renders correctly', () => {
   const {container} = render(<ButtonPlus />)

   expect(container.firstChild).toMatchSnapshot()
})

it('UI/ButtonPlus onClick function fired', () => {
    const onClick = jest.fn()
    const { container } = render(<ButtonPlus onClick={onClick} />)
    const button = container.querySelector('button')

    fireEvent.click(button)
    expect(onClick).toHaveBeenCalled()
 })
