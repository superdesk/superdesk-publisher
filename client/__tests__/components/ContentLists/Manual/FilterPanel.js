import React from "react";
import FilterPanel from "../../../../components/ContentLists/Manual/FilterPanel";
import { render, fireEvent } from "@testing-library/react";

import Publisher from "../../../../__mocks__/publisher";

jest.mock("react-select", () => props => "div");

const publisher = new Publisher();

let lists = [];
publisher.queryLists().then(items => (lists = items));

let api = () => {};

api.users = {};
api.users.query = function() {
  return new Promise((resolve, reject) => {
    resolve({
      _items: [{ is_author: true, display_name: "test author" }],
      _links: {}
    });
  });
};

describe("ContentLists/Manual/FilterPanel", () => {
  it("renders properly", async () => {
    const { container, getByText } = render(
      <FilterPanel
        toggle={jest.fn()}
        publisher={publisher}
        filter={jest.fn()}
        api={api}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("filter fired", async () => {
    const filter = jest.fn();
    const { container, getByText } = render(
      <FilterPanel
        toggle={jest.fn()}
        publisher={publisher}
        filter={filter}
        api={api}
      />
    );

    const filterButton = getByText("Filter");

    fireEvent.click(filterButton);
    expect(filter).toHaveBeenCalled();
    expect(filter).toHaveBeenCalledWith({ author: [], route: [] });
  });
});
