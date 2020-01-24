import React from "react";
import Swimlane from "../../../../components/Output/Swimlane/Swimlane";
import { render, wait } from "@testing-library/react";
import Store from "../../../../components/Output/Store";
import Publisher from "../../../../__mocks__/publisher";

const publisher = new Publisher();

jest.mock("react-virtualized/styles.css", () => {
  return {};
});
jest.mock("axios");
jest.mock("react-select", () => props => "div");

let api = () => { };

describe("Output/Swimlane/TenantBoard", () => {
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
          filters: { sort: "updated_at", order: "desc" },
          actions: { setFilters: jest.fn(), setArticlesCounts: jest.fn() }
        }}
      >
        <Swimlane />
      </Store.Provider>
    );

    await wait(() =>
      expect(container.querySelector(".sd-loader")).not.toBeInTheDocument(),
    )

    expect(container.firstChild).toMatchSnapshot();
  });
});
