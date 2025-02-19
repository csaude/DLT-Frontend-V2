import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Select, { SelectProps } from './Select';
import { Option } from '@app/utils/themes';

// Mock options
const mockOptions: Option[] = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
];

describe('Select Component', () => {
  const mockOnChange = jest.fn();

  const defaultProps: SelectProps = {
    disabled: false,
    options: mockOptions,
    value: '1',
    type: 'default',
    onChange: mockOnChange,
    className: '',
    children: 'Select an option',
  };

  it('renders the Select component with default props', () => {
    const { getByText, getByLabelText } = render(<Select {...defaultProps} />);
    expect(getByText('Select an option')).toBeInTheDocument();
    expect(getByLabelText('Select an option')).toBeInTheDocument();
    expect(getByLabelText('Select an option')).toHaveValue('1');
  });

  it('calls onChange when a new option is selected', () => {
    const { getByLabelText } = render(<Select {...defaultProps} />);
    const selectElement = getByLabelText('Select an option');

    // Simulate changing the value
    fireEvent.change(selectElement, { target: { value: '2' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('2');
  });

  it('renders the correct class for the custom type', () => {
    const { getByLabelText } = render(
      <Select {...defaultProps} type="custom" />
    );
    const selectElement = getByLabelText('Select an option');
    expect(selectElement).toHaveClass('custom-select');
  });

  it('renders the correct class for the default type', () => {
    const { getByLabelText } = render(<Select {...defaultProps} />);
    const selectElement = getByLabelText('Select an option');
    expect(selectElement).toHaveClass('form-control');
  });

  it('renders the correct options', () => {
    const { getByText } = render(<Select {...defaultProps} />);
    expect(getByText('Option 1')).toBeInTheDocument();
    expect(getByText('Option 2')).toBeInTheDocument();
  });

  it('disables the select when the disabled prop is true', () => {
    const { getByLabelText } = render(
      <Select {...defaultProps} disabled={true} />
    );
    const selectElement = getByLabelText('Select an option');
    expect(selectElement).toBeDisabled();
  });
});
