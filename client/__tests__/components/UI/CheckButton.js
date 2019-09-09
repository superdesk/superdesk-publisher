import React from "react";
import CheckButton from "../../../components/UI/CheckButton";
import { render, fireEvent, getByText } from "@testing-library/react";

describe("UI/CheckButton", () => {
  it("renders correctly", () => {
    const { container, getByText } = render(
      <CheckButton label="testlabel" onClick={jest.fn()} isChecked={true} />
    );

    expect(getByText("testlabel")).toBeInTheDocument();
    expect(container.querySelector(".sd-checkbox")).toHaveClass("checked");
    expect(container.firstChild).toMatchSnapshot();
  });

  it("onClick function fired", () => {
    const onClick = jest.fn();
    const { container } = render(
      <CheckButton label="testlabel" onClick={onClick} isChecked={true} />
    );
    const button = container.querySelector(".sd-check__wrapper");

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });
});
