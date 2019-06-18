import React from 'react'
import ContentLists from '../../../components/TargetedPublishing/ContentLists'
import { render, fireEvent, waitForElement, wait } from '@testing-library/react'


describe('TargetedPublishing/ContentLists', () => {

    const ruleLists = [
        {
            id: 1,
            position: 0

        }
    ]

    const contentLists = [
        {
            content_list_items_count: 10,
            id: 1,
            name: "test1"
        },
        {
            content_list_items_count: 5,
            id: 2,
            name: "test2"
        }
    ]


    it('renders correctly', () => {
        const { container } = render(<ContentLists
                                        removeList={jest.fn()}
                                        save={jest.fn()}
                                        addList={jest.fn()}
                                        ruleLists={ruleLists}
                                        contentLists={contentLists}/>)

        expect(container.firstChild).toMatchSnapshot()
    })

    it('renders add button', async () => {
        const { getByText } = render(<ContentLists
                                        removeList={jest.fn()}
                                        save={jest.fn()}
                                        addList={jest.fn()}
                                        ruleLists={ruleLists}
                                        contentLists={contentLists}/>)


        await waitForElement(() => getByText('Add to content list'))
    })

    it('hides add button when there are no content lists left', async () => {
        let newRulesList = [...ruleLists];

        newRulesList.push({
            id: 2,
            position: 0
        })

        const { queryByText } = render(<ContentLists
                                        removeList={jest.fn()}
                                        save={jest.fn()}
                                        addList={jest.fn()}
                                        ruleLists={newRulesList}
                                        contentLists={contentLists}/>)


        await wait(() =>
            expect(queryByText('Add to content list')).not.toBeInTheDocument()
        )
    })

    it('fires addList', async () => {
        const addList = jest.fn()

        const { getByText } = render(<ContentLists
                                        removeList={jest.fn()}
                                        save={jest.fn()}
                                        addList={addList}
                                        ruleLists={ruleLists}
                                        contentLists={contentLists}/>)

        const button = await waitForElement(() => getByText('Add to content list'))

        fireEvent.click(button)

        expect(addList).toHaveBeenCalled()
    })
})
