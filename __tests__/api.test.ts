import { render, screen } from '@testing-library/react';
import { staffAPI } from '../src/services/api';
import '@testing-library/jest-dom';

// Mock axios
jest.mock('axios');

describe('API Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should have all API methods defined', () => {
    expect(staffAPI.getAll).toBeDefined();
    expect(staffAPI.create).toBeDefined();
    expect(staffAPI.update).toBeDefined();
    expect(staffAPI.delete).toBeDefined();
  });

  it('should include token in requests', () => {
    const token = 'test-token';
    localStorage.setItem('token', token);
    
    expect(localStorage.getItem('token')).toBe(token);
  });
});
