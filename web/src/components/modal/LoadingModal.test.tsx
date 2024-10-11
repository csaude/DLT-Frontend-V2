import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoadingModal from "./LoadingModal";
import { Modal } from "antd";

// Mock the Modal component from Ant Design
jest.mock("antd", () => ({
  Modal: jest.fn(({ visible, children }) => (visible ? <div>{children}</div> : null)),
  Spin: jest.fn(({ tip, children }) => (
    <div>
      <div data-testid="spin-tip">{tip}</div>
      {children}
    </div>
  )),
}));

describe("LoadingModal Component", () => {
  test("renders modal when 'modalVisible' is true", () => {
    render(<LoadingModal modalVisible={true} message="Loading..." />);
    
    // Check if the modal is rendered
    const modal = screen.getByText("Loading...");
    expect(modal).toBeInTheDocument();
  });

  test("does not render modal when 'modalVisible' is false", () => {
    render(<LoadingModal modalVisible={false} message="Loading..." />);
    
    // Check that modal content is not visible
    const modalContent = screen.queryByText("Loading...");
    expect(modalContent).not.toBeInTheDocument();
  });

  test("displays default loading message when message is undefined", () => {
    render(<LoadingModal modalVisible={true} />);
    
    const defaultTip = screen.getByTestId("spin-tip");
    expect(defaultTip).toHaveTextContent("Carregando. Aguarde Por Favor.");
  });

  test("displays custom message when provided", () => {
    render(<LoadingModal modalVisible={true} message="Custom Loading Message" />);
    
    const customTip = screen.getByTestId("spin-tip");
    expect(customTip).toHaveTextContent("Custom Loading Message");
  });
});
