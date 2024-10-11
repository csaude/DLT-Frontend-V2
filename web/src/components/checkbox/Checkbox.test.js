import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Checkbox, { CheckboxProps } from './Checkbox';

describe('Checkbox Component', () => {
  const defaultProps: CheckboxProps = {
    checked: false,
    children: 'Test Checkbox',
  };

  it('renders the Checkbox component', () => {
    render(<Checkbox {...defaultProps} />);
    const checkbox = screen.getByLabelText('Test Checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('renders with "icheck" type', () => {
    render(<Checkbox {...defaultProps} type="icheck" />);
    const checkboxContainer = screen.getByLabelText('Test Checkbox').parentElement;
    expect(checkboxContainer).toHaveClass('icheck-primary');
  });

  it('renders with "custom" type', () => {
    render(<Checkbox {...defaultProps} type="custom" />);
    const checkboxContainer = screen.getByLabelText('Test Checkbox').parentElement;
    expect(checkboxContainer).toHaveClass('custom-control custom-checkbox');
    const checkbox = screen.getByLabelText('Test Checkbox');
    expect(checkbox).toHaveClass('custom-control-input');
    const label = screen.getByText('Test Checkbox');
    expect(label).toHaveClass('custom-control-label');
  });

  it('renders with default type', () => {
    render(<Checkbox {...defaultProps} />);
    const checkboxContainer = screen.getByLabelText('Test Checkbox').parentElement;
    expect(checkboxContainer).toHaveClass('form-check');
    const checkbox = screen.getByLabelText('Test Checkbox');
    expect(checkbox).toHaveClass('form-check-input');
    const label = screen.getByText('Test Checkbox');
    expect(label).toHaveClass('form-check-label');
  });

  it('calls onChange when the checkbox is clicked', () => {
    const handleChange = jest.fn();
    render(<Checkbox {...defaultProps} onChange={handleChange} />);
    const checkbox = screen.getByLabelText('Test Checkbox');
    
    // Simulate click event
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(true);

    // Simulate another click to uncheck
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it('syncs value with checked prop', () => {
    const { rerender } = render(<Checkbox {...defaultProps} checked={false} />);
    const checkbox = screen.getByLabelText('Test Checkbox');
    
    expect(checkbox).not.toBeChecked();

    // Re-render with checked true
    rerender(<Checkbox {...defaultProps} checked={true} />);
    expect(checkbox).toBeChecked();
  });
});
