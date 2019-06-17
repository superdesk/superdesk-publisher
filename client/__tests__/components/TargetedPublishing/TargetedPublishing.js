import React from 'react'
import TargetedPublishing from '../../../components/TargetedPublishing/TargetedPublishing'
import { render, fireEvent, waitForElement } from '@testing-library/react'
import axios from 'axios'

jest.mock("axios")

describe('TargetedPublishing/TargetedPublishing', () => {

    const rules = [
        {
            tenant: {
                code: "eif0ca",
                subdomain: 'tenant1',
                domain_name: 'surcefabric.org'
            }
        }
    ]

    it('renders "no websites has been set" and add website component', async () => {
        const { container, getByText } = render(<TargetedPublishing
                                        apiUrl="example.com/"
                                        apiHeader={{Authrization: 'Basic 1234567'}}
                                        item={{}}
                                        reload={jest.fn()}
                                        config={{}}
                                        rules={[]}/>)

        const alert = container.querySelector('.tp-alert')

        expect(container.firstChild).toMatchSnapshot()
        expect(alert).toBeInTheDocument()
        expect(getByText('Add Website')).toBeInTheDocument()
    })

})
