import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('renders with default black style', () => {
    render(<Button>Click</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-black')
    expect(button).toHaveClass('text-white')
  })

  it('renders outline variant with black border', () => {
    render(<Button variant="outline">Outline</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border')
    expect(button).toHaveClass('border-black')
    expect(button).toHaveClass('bg-white')
  })

  it('handles click events', () => {
    const onClick = jest.fn()
    render(<Button onClick={onClick}>Click</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalled()
  })
})