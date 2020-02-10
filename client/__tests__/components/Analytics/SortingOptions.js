import React from "react";
import SortingOptions from "../../../components/Analytics/SortingOptions";
import { render } from "@testing-library/react";

describe("Analytics/SortingOptions", () => {
  const filters = {
    sort: "publish_date",
    order: "desc"
  };

  it("renders correctly", () => {
    const { container } = render(<SortingOptions filters={filters} setFilters={jest.fn()} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
