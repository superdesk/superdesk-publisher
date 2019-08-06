import React from "react";
import Check from "../../../components/UI/Check";
import { render, fireEvent, getByText } from "@testing-library/react";

describe("UI/Check", () => {
  it("renders correctly", () => {
    const { container, getByText } = render(
      <Check label="testlabel" onClick={jest.fn()} isChecked={true} />
    );

    expect(getByText("testlabel")).toBeInTheDocument();
    expect(container.querySelector(".sd-checkbox")).toHaveClass("checked");
    expect(container.firstChild).toMatchSnapshot();
  });

  it("onClick function fired", () => {
    const onClick = jest.fn();
    const { container } = render(
      <Check label="testlabel" onClick={onClick} isChecked={true} />
    );
    const button = container.querySelector(".sd-check__wrapper");

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });
});
