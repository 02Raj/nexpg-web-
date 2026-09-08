import { render, screen } from '@testing-library/react'
import MarketingPage from '../app/page'

// Mock the AuthProvider
jest.mock('@/providers/AuthProvider', () => ({
  useAuth: () => ({ session: null }),
}))

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('MarketingPage', () => {
  it('renders the hero section correctly', () => {
    render(<MarketingPage />)
    
    const headings = screen.getAllByText(/Run your PG/i)
    expect(headings[0]).toBeInTheDocument()
  })
})
