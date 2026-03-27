import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import SearchBar from '../SearchBar'

describe('SearchBar', () => {
  it('renders an input field', () => {
    render(<SearchBar onSearch={() => {}} isLoading={false} />)
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })

  it('calls onSearch with input value on Enter', async () => {
    const onSearch = vi.fn()
    const user = userEvent.setup()
    render(<SearchBar onSearch={onSearch} isLoading={false} />)

    const input = screen.getByPlaceholderText(/search/i)
    await user.type(input, 'Radiohead{Enter}')

    expect(onSearch).toHaveBeenCalledWith('Radiohead')
  })

  it('does not call onSearch on Enter if input is empty', async () => {
    const onSearch = vi.fn()
    const user = userEvent.setup()
    render(<SearchBar onSearch={onSearch} isLoading={false} />)

    const input = screen.getByPlaceholderText(/search/i)
    await user.type(input, '{Enter}')

    expect(onSearch).not.toHaveBeenCalled()
  })

  it('disables input when isLoading is true', () => {
    render(<SearchBar onSearch={() => {}} isLoading={true} />)
    expect(screen.getByPlaceholderText(/search/i)).toBeDisabled()
  })
})
