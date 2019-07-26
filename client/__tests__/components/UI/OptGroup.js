import React from "react";
import OptGroup from "../../../components/UI/OptGroup";
import { render } from "@testing-library/react";

const list = [{ id: 2, name: "el1" }, { id: 3, name: "el2" }];

describe("UI/OptGroup", () => {
  it("renders correctly", () => {
    const { container } = render(
      <OptGroup list={list} valueField="id" nameField="name" label="Custom" />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
