import React from "react";
import FilterPanel from "../../../../components/ContentLists/Automatic/FilterPanel";
import { render } from "@testing-library/react";

import Publisher from "../../../../__mocks__/publisher";

const publisher = new Publisher();

jest.mock("react-select", () => props => "div");

let lists = [];
publisher.queryLists().then(items => (lists = items));

let api = () => { };

api.users = {};
api.users.query = function () {
  return new Promise((resolve, reject) => {
    resolve({
      _items: [{ is_author: true, display_name: "test author" }],
      _links: {}
    });
  });
};

describe("ContentLists/Automatic/FilterPanel", () => {
  it("renders properly", async () => {
    const { container, getByText } = render(
      <FilterPanel
        toggle={jest.fn()}
        list={lists[0]}
        publisher={publisher}
        filters={lists[0].filters}
        api={api}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
