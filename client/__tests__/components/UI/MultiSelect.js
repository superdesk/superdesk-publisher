import React from "react";
import MultiSelect from "../../../components/UI/MultiSelect";
import { render } from "@testing-library/react";

const options = [{ label: "1", value: 1 }, { label: "2", value: 2 }];

const selectedOptions = [{ label: "1", value: 1 }];

describe("UI/MultiSelect", () => {
  it("renders correcty", () => {
    const { container } = render(
      <MultiSelect
        options={options}
        selectedOptions={selectedOptions}
        onSelect={jest.fn()}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
