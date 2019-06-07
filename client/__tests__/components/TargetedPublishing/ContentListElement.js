import React from 'react'
import ContentListElement from '../../../components/TargetedPublishing/ContentListElement'
import { render, fireEvent, wait, waitForElement } from '@testing-library/react'
import axios from 'axios'

jest.mock("axios")

describe('TargetedPublishing/ContentListElement', () => {
    it('dummy', () => {
        expect(1).toBeTruthy()
    })
})
