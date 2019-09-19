import React from "react";
import ButtonListItem from "../../../components/UI/ButtonListItem";
import { render, fireEvent, getByText } from "@testing-library/react";

describe("UI/ButtonListItem", () => {
  it("renders correctly", () => {
    const { container, getByText } = render(
      <ButtonListItem label="testlabel" onClick={jest.fn()} />
    );

    expect(getByText("testlabel")).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });

  it("onClick function fired", () => {
    const onClick = jest.fn();
    const { container } = render(
      <ButtonListItem label="testlabel" onClick={onClick} />
    );
    const button = container.querySelector(".sd-list-item");

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });
});
