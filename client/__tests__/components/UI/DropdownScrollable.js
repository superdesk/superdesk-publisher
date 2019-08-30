import React from "react";
import DropdownScrollable from "../../../components/UI/DropdownScrollable";
import { render, fireEvent, getByText } from "@testing-library/react";

describe("UI/Dropdown", () => {
  it("renders itself, children and button correcty", () => {
    const { container, getByText } = render(
      <DropdownScrollable button={<button>button</button>}>
        <span>child</span>
      </DropdownScrollable>
    );

    expect(getByText("child")).toBeInTheDocument();
    expect(getByText("button")).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });

  it("toggles correctly", () => {
    const { container, getByText } = render(
      <DropdownScrollable button={<button>button</button>}>
        <span>child</span>
      </DropdownScrollable>
    );
    const button = container.querySelector("button");

    fireEvent.click(button);
    expect(container.querySelector(".dropdown")).toHaveClass("open");
    fireEvent.click(button);
    expect(container.querySelector(".dropdown")).not.toHaveClass("open");
  });
});
