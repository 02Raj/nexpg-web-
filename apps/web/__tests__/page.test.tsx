import { render, screen } from '@testing-library/react'
import { MarketingHome } from '../app/MarketingHome'

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
    render(<MarketingHome />)

    const headings = screen.getAllByText(/Run your PG/i)
    expect(headings[0]).toBeInTheDocument()
    expect(screen.getAllByText(/PG Management Software/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/What is RunMyPG\?/i)).toBeInTheDocument()
  })
})
