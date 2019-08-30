import React from "react";
import Dropdown from "../../../components/UI/Dropdown";
import { render, fireEvent, getByText } from "@testing-library/react";

describe("UI/Dropdown", () => {
  it("renders itself, children and button correcty", () => {
    const { container, getByText } = render(
      <Dropdown button={<button>button</button>}>
        <span>child</span>
      </Dropdown>
    );

    expect(getByText("child")).toBeInTheDocument();
    expect(getByText("button")).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });

  it("toggles correctly", () => {
    const { container, getByText } = render(
      <Dropdown button={<button>button</button>}>
        <span>child</span>
      </Dropdown>
    );
    const button = container.querySelector("button");

    fireEvent.click(button);
    expect(container.querySelector(".dropdown")).toHaveClass("open");
    fireEvent.click(button);
    expect(container.querySelector(".dropdown")).not.toHaveClass("open");
  });
});
