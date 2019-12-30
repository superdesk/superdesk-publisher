import React from "react";
import FilterPane from "../../../components/Output/FilterPane";
import { render } from "@testing-library/react";
import Store from "../../../components/Output/Store";

jest.mock("react-select", () => props => "div");

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

describe("Output/FilterPane", () => {
  it("renders properly", async () => {
    const { container } = render(
      <Store.Provider
        value={{
          api: api,
          tenants: [
            {
              name: 'tenant1', code: 'tenant1', routes: [
                { name: 'testroute1', id: 1 },
                { name: 'testroute2', id: 2 },
              ]
            },
            { name: 'tenant2', code: 'tenant2', routes: [] }
          ],

          actions: { setFilters: jest.fn() }
        }}
      >
        <FilterPane
          toggle={jest.fn()}
          isOpen={true}
        />
      </Store.Provider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
