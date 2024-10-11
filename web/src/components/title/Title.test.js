import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // for better matchers
import AppTitle from './appTitle';

describe('AppTitle Component', () => {
  it('renders the correct title', () => {
    const { getByText } = render(<AppTitle />);
    const titleElement = getByText(/Sistema de Registo e Acompanhamento de Beneficiárias do Programa DREAMS/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('renders with correct styles', () => {
    const { getByText } = render(<AppTitle />);
    const titleElement = getByText(/Sistema de Registo e Acompanhamento de Beneficiárias do Programa DREAMS/i);

    // Check the styles
    expect(titleElement).toHaveStyle({
      textAlign: 'center',
      fontWeight: 'bold',
      color: '#17a2b8',
    });
  });
});
