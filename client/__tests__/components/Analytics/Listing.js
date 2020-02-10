import React from "react";
import Listing from "../../../components/Analytics/Listing";
import { render } from "@testing-library/react";

jest.mock("react-virtualized/styles.css", () => {
  return {};
});

const articles = {
  items: [],
  page: 0,
  totalPages: 1,
  loading: false,
  itemSize: 50
};

describe("Analytics/Listing", () => {
  it("renders correctly", async () => {
    const { container } = render(
      <Listing articles={articles}
        loading={false}
        queryArticles={jest.fn()} />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
