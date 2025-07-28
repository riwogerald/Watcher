import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { LoginForm } from './LoginForm';

const LoginFormWrapper = () => (
  <BrowserRouter>
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  </BrowserRouter>
);

describe('LoginForm', () => {
  it('renders login form elements', () => {
    render(<LoginFormWrapper />);
    
    expect(screen.getByText('Watcher')).toBeInTheDocument();
    expect(screen.getByText('Incident Reporting System')).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows demo credentials', () => {
    render(<LoginFormWrapper />);
    
    expect(screen.getByText('Demo Credentials')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Employee')).toBeInTheDocument();
    expect(screen.getByText('IT Support')).toBeInTheDocument();
  });

  it('allows user to input email and password', async () => {
    const user = userEvent.setup();
    render(<LoginFormWrapper />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<LoginFormWrapper />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByRole('button', { name: '' }); // Eye icon button
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('fills form when demo credential is clicked', async () => {
    const user = userEvent.setup();
    render(<LoginFormWrapper />);
    
    const adminOption = screen.getByText('admin@company.com');
    await user.click(adminOption.closest('div')!);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    expect(emailInput).toHaveValue('admin@company.com');
    expect(passwordInput).toHaveValue('password');
  });
});
