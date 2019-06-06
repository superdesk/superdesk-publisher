import React from 'react'
import AddWebsite from '../../../components/TargetedPublishing/AddWebsite'
import { render, fireEvent } from '@testing-library/react'
import axios from 'axios'

jest.mock("axios")

describe('TargetedPublishing/AddWebsite', () => {

    it('should fire getSites() when mounted', () => {
        const getSpy = jest.spyOn(axios, 'get');
        const { container } = render(<AddWebsite setNewDestination={jest.fn()}
                                        apiUrl="example.com"
                                        apiHeader={{Authrization: 'Basic 123456'}}
                                        rules={[]}/>)

        expect(getSpy).toHaveBeenCalled()
    })
})
