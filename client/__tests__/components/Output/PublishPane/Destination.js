import React from "react";
import Destination from "../../../../components/Output/PublishPane/Destination";
import { render } from "@testing-library/react";
import Store from "../../../../components/Output/Store";

const destination = {
  tenant: {
    name: 'tenant1', code: 'tenant1',
    content_lists: [
      { type: "manual", id: 1, name: 'list1', content_list_items_count: 10 },
      { type: "automatic", id: 2, name: 'listAutomatic' },
      { type: "manual", id: 3, name: 'list3', content_list_items_count: 2 },
      { type: "manual", id: 4, name: 'list4', content_list_items_count: 0 }
    ]
  },
  route: {},
  is_published_fbia: false,
  paywall_secured: false,
  status: "new",
  content_lists: []
}

describe("Output/PublishPane/Destination", () => {

  it("renders correctly", () => {
    const { container } = render(
      <Store.Provider
        value={{
          config: { publisher: {} },
          tenants: [
            {
              name: 'tenant1', code: 'tenant1', paywall_enabled: true, fbia_enabled: false,
              routes: [
                { name: 'testroute1', id: 1 },
                { name: 'testroute2', id: 2 },
              ]
            },
            { name: 'tenant2', code: 'tenant2', routes: [] }
          ]
        }}
      >
        <Destination
          destination={destination}
          originalDestination={destination}
          update={jest.fn()}
          remove={jest.fn()}
          openMetadataEditor={jest.fn()}
          openPreview={jest.fn()} />
      </Store.Provider>
    );
    expect(container.firstChild).toMatchSnapshot();

  });

});
