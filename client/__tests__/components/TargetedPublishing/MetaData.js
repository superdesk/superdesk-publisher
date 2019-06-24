import React from "react";
import MetaData from "../../../components/TargetedPublishing/MetaData";
import { render, fireEvent } from "@testing-library/react";

describe("TargetedPublishing/MetaData", () => {
  const item = {
    guid: "asdfasdf87876876"
  };

  it("renders correctly", () => {
    const { container } = render(
      <MetaData
        apiUrl="example.com/"
        apiHeader={{ Authrization: "Basic 1234567" }}
        item={item}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
