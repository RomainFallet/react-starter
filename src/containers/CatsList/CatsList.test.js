import React from 'react'
import { render, wait, fireEvent } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import CatsList from './CatsList'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const axiosMock = new MockAdapter(axios)
expect.extend(toHaveNoViolations)

describe('<CatsList />', () => {
  beforeEach(() => {
    axiosMock.reset()
    jest.clearAllMocks()
  })

  it('should display cats when component is loaded', async () => {
    // Arrange
    expect.assertions(4)
    axiosMock.onGet().reply(200, [
      { id: 1, url: 'https://example.com' },
      { id: 2, url: 'https://example.com' }
    ])
    jest.spyOn(axios, 'get')

    // Act
    const { findAllByAltText, container } = render(<CatsList />)
    const cats = await findAllByAltText('Cat')

    // Assert
    expect(await axe(container)).toHaveNoViolations()
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith(
      'https://api.thecatapi.com/v1/images/search?limit=5'
    )
    expect(cats).toHaveLength(2)
  })

  it('should be able to display new cats manually', async () => {
    // Arrange
    expect.assertions(3)
    axiosMock.onGet().reply(200, [
      { id: 1, url: 'https://example.com' },
      { id: 2, url: 'https://example.com' }
    ])
    jest.spyOn(axios, 'get')
    const { findAllByAltText, getByText } = render(<CatsList />)
    await wait()
    const button = getByText('I want new cats!')

    // Act
    fireEvent.click(button)
    const cats = await findAllByAltText('Cat')

    // Assert
    expect(axios.get).toHaveBeenCalledTimes(2)
    expect(axios.get).toHaveBeenLastCalledWith(
      'https://api.thecatapi.com/v1/images/search?limit=5'
    )
    expect(cats).toHaveLength(2)
  })
})
