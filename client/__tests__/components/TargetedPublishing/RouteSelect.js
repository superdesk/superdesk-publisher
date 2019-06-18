import React from 'react'
import RouteSelect from '../../../components/TargetedPublishing/RouteSelect'
import { render, fireEvent, waitForElement } from '@testing-library/react'
import axios from 'axios'

jest.mock("axios")

describe('TargetedPublishing/RouteSelect', () => {

    it('renders correctly', async () => {
        const { container, getByText } = render(<RouteSelect
                                        apiUrl="example.com/"
                                        apiHeader={{Authrization: 'Basic 1234567'}}
                                        onChange={jest.fn()}
                                        selectedRouteId={2}/>)

        await waitForElement(() => getByText('route2'))

        expect(container.firstChild).toMatchSnapshot()
    })

    it('fires onChange', async () => {
        const onChange = jest.fn()
        const { container} = render(<RouteSelect
                                        apiUrl="example.com/"
                                        apiHeader={{Authrization: 'Basic 1234567'}}
                                        onChange={onChange}
                                        selectedRouteId={2}/>)

        const select = container.querySelector('select[name="routeId"]')

        fireEvent.change(select, {target: {value: 1}})
        expect(onChange).toHaveBeenCalled()
    })
})
