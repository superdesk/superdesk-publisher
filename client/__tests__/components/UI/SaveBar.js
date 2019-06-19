import React from "react";
import SaveBar from "../../../components/UI/SaveBar";
import { render, fireEvent } from "@testing-library/react";

describe("UI/SaveBar", () => {
  it("renders correctly", () => {
    const { container } = render(
      <SaveBar save={jest.fn()} cancel={jest.fn()} />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it("save function fired", () => {
    const save = jest.fn();
    const { container } = render(<SaveBar save={save} cancel={jest.fn()} />);
    const button = container.querySelector("button");

    fireEvent.click(button);
    expect(save).toHaveBeenCalled();
  });

  it("cancel function fired", () => {
    const cancel = jest.fn();
    const { getByText } = render(<SaveBar cancel={cancel} save={jest.fn()} />);

    fireEvent.click(getByText(/cancel/i));
    expect(cancel).toHaveBeenCalled();
  });

  it("isDisabled blocks save button", () => {
    const save = jest.fn();
    const { container } = render(
      <SaveBar save={save} isDisabled={true} cancel={jest.fn()} />
    );
    const button = container.querySelector("button");

    fireEvent.click(button);
    expect(save).not.toHaveBeenCalled();
  });
});
