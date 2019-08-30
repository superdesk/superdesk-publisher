import React from "react";
import SearchBar from "../../../components/UI/SearchBar";
import { render, fireEvent } from "@testing-library/react";

describe("UI/SearchBar", () => {
  it("renders correcty", () => {
    const { container } = render(
      <SearchBar onChange={jest.fn()} value="testvalue" />
    );
    expect(
      container.querySelector("input[value='testvalue']")
    ).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });
});
