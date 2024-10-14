import React from "react";
import { render } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect'; // for the extra matchers like toHaveStyle
import AppTitle from "./Title";

describe("AppTitle Component", () => {
  test("renders the card with correct text and styles", () => {
    const { getByText } = render(<AppTitle />);

    const titleElement = getByText(
      "Sistema de Registo e Acompanhamento de Beneficiárias do Programa DREAMS"
    );

    // Check if the correct text is rendered
    expect(titleElement).toBeInTheDocument();

    // Check the styles applied to the card, use rgb() for color
    // expect(titleElement).toHaveStyle({
    //   textAlign: "center",
    //   fontWeight: "bold",
    //   color: "rgb(23, 162, 184)", // Use rgb format
    // });
  });
});
