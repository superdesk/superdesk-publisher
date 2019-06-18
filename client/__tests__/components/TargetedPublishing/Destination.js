import React from 'react'
import Destination from '../../../components/TargetedPublishing/Destination'
import { render, fireEvent, waitForElement, wait, getByLabelText } from '@testing-library/react'


describe('TargetedPublishing/Destination', () => {

    const item = {
        guid: 'asdfasdf87876876'
    }

    const config = {
        publisher: {
            protocol: 'https',
        }
    }

    const rule = {
        tenant: {
            code: "eif0ca",
            subdomain: 'tenant1',
            domain_name: 'sourcefabric.org',
            fbia_enabled: true,
            paywall_enabled: false,
            output_channel: false,

        },
        route: {
            name: 'route',
            id: 1

        },
        is_published_fbia: false,
        published: true,
        paywall_secured: false
    }

    const site = {
        code: "ml2woe",
        domain_name: "sourcefabric.org",
        fbia_enabled: true,
        id: 1,
        name: "tenant 1",
        output_channel: null,
        paywall_enabled: true,
        subdomain: "tenant-1"
    }

    it('renders correctly', async () => {
        const { container } = render(<Destination
                                        apiHeader={{Authrization: 'Basic 1234567'}}
                                        config={config}
                                        site={site}
                                        item={item}
                                        rule={rule}
                                        cancel={jest.fn()}
                                        done={jest.fn()}
                                        isOpen={false}/>)

        expect(container.firstChild).toMatchSnapshot()
    })

    it('renders SaveBar with disabled save when new destination', async () => {
        // no rule prop
        const { getByText } = render(<Destination
                                        apiHeader={{Authrization: 'Basic 1234567'}}
                                        config={config}
                                        site={site}
                                        item={item}
                                        cancel={jest.fn()}
                                        done={jest.fn()}
                                        isOpen={true}/>)

        const saveButton = getByText('Save')

        expect(saveButton.disabled).toBeTruthy()
    })

    it('rerenders preview', async () => {
        const { container, getByText } = render(<Destination
                                        apiHeader={{Authrization: 'Basic 1234567'}}
                                        config={config}
                                        site={site}
                                        item={item}
                                        rule={rule}
                                        cancel={jest.fn()}
                                        done={jest.fn()}
                                        isOpen={false}/>)

        const select = container.querySelector('select[name="routeId"]')

        fireEvent.change(select, {target: {value: 2}})

        const previewButton = await waitForElement(() => container.querySelector('a[sd-tooltip="Preview"]'))

        expect(previewButton).toHaveAttribute('href', 'https://sourcefabric.org/preview')
    })

    it('changes route, shows SaveBar and fires cancel', async () => {
        const cancel = jest.fn()
        const { container, getByText } = render(<Destination
                                        apiHeader={{Authrization: 'Basic 1234567'}}
                                        config={config}
                                        site={site}
                                        item={item}
                                        rule={rule}
                                        cancel={cancel}
                                        done={jest.fn()}
                                        isOpen={false}/>)

        const select = container.querySelector('select[name="routeId"]')

        fireEvent.change(select, {target: {value: 2}})

        const cancelButton = getByText('Cancel')

        fireEvent.click(cancelButton)

        expect(cancel).toHaveBeenCalled()
    })
})
