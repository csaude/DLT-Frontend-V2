// AppButton.test.js
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AppButton from './Button';

describe('AppButton Component', () => {
  it('renders children correctly', () => {
    const { getByText } = render(<AppButton>Click Me</AppButton>);

    expect(getByText('Click Me')).toBeInTheDocument();
  });

  it('displays the icon if the icon prop is passed', () => {
    const { container } = render(<AppButton icon="facebook">Login</AppButton>);

    const icon = container.querySelector('i');
    expect(icon).toHaveClass('fab fa-facebook');
  });

  it('displays the spinner when isLoading is true', () => {
    const { getByTestId } = render(<AppButton isLoading>Submit</AppButton>);

    const spinner = getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('spinner-border'); // Bootstrap's spinner class
  });

  it('disables the button when isLoading or disabled is true', () => {
    const { getByRole, rerender } = render(
      <AppButton isLoading>Submit</AppButton>
    );

    let button = getByRole('button');
    expect(button).toBeDisabled();

    // Now test with the `disabled` prop
    rerender(<AppButton disabled>Submit</AppButton>);
    button = getByRole('button');
    expect(button).toBeDisabled();
  });

  it('applies the correct theme (variant)', () => {
    const { getByRole } = render(
      <AppButton theme="secondary">Submit</AppButton>
    );

    const button = getByRole('button');
    expect(button).toHaveClass('btn-secondary'); // Bootstrap applies btn-variant classes
  });

  it('spreads otherProps correctly onto the button', () => {
    const { getByRole } = render(
      <AppButton type="submit" id="custom-button">Submit</AppButton>
    );

    const button = getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('id', 'custom-button');
  });
});
