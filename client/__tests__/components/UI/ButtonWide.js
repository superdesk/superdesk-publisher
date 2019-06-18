import React from "react";
import ButtonWide from "../../../components/UI/ButtonWide";
import { render, fireEvent } from "@testing-library/react";

describe("UI/ButtonWide", () => {
  it("renders correctly", () => {
    const { container } = render(<ButtonWide label="Label" />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it("onClick function fired", () => {
    const onClick = jest.fn();
    const { container } = render(<ButtonWide onClick={onClick} />);
    const button = container.querySelector("button");

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });
});
