// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from "react";
import { render } from "@testing-library/react";
import '@testing-library/jest-dom'
import Spinner from "./Spinner"

test('renders correctly with on prop', () => {
  const { rerender } = render(<Spinner on={false} />);

  expect(document.querySelector('#spinner')).not.toBeInTheDocument()

  rerender(<Spinner on={true} />)

  expect(document.querySelector('#spinner')).toBeInTheDocument();
})
