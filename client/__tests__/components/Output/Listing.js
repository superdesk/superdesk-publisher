import React from "react";
import Listing from "../../../components/Output/Listing";
import { render, waitForElement } from "@testing-library/react";
import axios from "axios";
import Store from "../../../components/Output/Store";

import Publisher from "../../../__mocks__/publisher";

const publisher = new Publisher();

jest.mock("react-virtualized/styles.css", () => {
  return {};
});
jest.mock("axios");
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

describe("Output/Listing", () => {
  it("renders properly", async () => {
    const { container, getByText } = render(
      <Store.Provider
        value={{
          publisher: publisher,
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
        <Listing
          type="published"
          hide={false}
        />
      </Store.Provider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
