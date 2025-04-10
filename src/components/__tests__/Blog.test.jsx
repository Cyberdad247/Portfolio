import React from 'react';
import { render, screen } from '@testing-library/react';
import Blog from '../Blog';
import { describe, it, expect } from 'vitest';

describe('Blog Component', () => {
  it('renders the blog section title', () => {
    render(<Blog />);
    expect(screen.getByText('Our Blog')).toBeInTheDocument();
  });

  it('renders all blog posts', () => {
    render(<Blog />);
    const posts = screen.getAllByRole('article');
    expect(posts.length).toBe(3);
  });

  it('displays correct post information', () => {
    render(<Blog />);
    expect(screen.getByText('Digital Marketing Trends 2023')).toBeInTheDocument();
    expect(screen.getByText('May 15, 2023')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});