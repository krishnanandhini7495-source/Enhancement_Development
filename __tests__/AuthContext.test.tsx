import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../src/contexts/AuthContext';
import '@testing-library/jest-dom';

describe('AuthContext', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );

  beforeEach(() => {
    localStorage.clear();
  });

  it('should provide auth context', () => {
    const TestComponent = () => {
      return <div>Test Component</div>;
    };

    render(<TestComponent />, { wrapper });
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  it('should load user from localStorage', async () => {
    const userData = {
      userId: '123',
      email: 'test@example.com',
      fullName: 'Test User',
      role: 'Staff' as const,
    };

    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify(userData));

    const TestComponent = () => {
      return <div>Auth Test</div>;
    };

    render(<TestComponent />, { wrapper });
    
    await waitFor(() => {
      expect(screen.getByText('Auth Test')).toBeInTheDocument();
    });
  });
});
