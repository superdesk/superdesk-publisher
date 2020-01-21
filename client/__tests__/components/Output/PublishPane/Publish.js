import React from "react";
import Publish from "../../../../components/Output/PublishPane/Publish";
import { render, fireEvent } from "@testing-library/react";
import Store from "../../../../components/Output/Store";

const destinations = [
  {
    status: "published", tenant: {
      name: 'tenant1', code: 'tenant1',
      content_lists: [
        { type: "manual", id: 1, name: 'list1', content_list_items_count: 10 },
        { type: "automatic", id: 2, name: 'listAutomatic' },
        { type: "manual", id: 3, name: 'list3', content_list_items_count: 2 },
        { type: "manual", id: 4, name: 'list4', content_list_items_count: 0 }
      ]
    },
    route: { id: 1, name: "testroute1" },
    is_published_fbia: false,
    paywall_secured: false,
    status: "new",
    content_lists: []
  }
];

describe("Output/PublishPane/Publish", () => {
  it("renders properly", async () => {
    const { container } = render(
      <Store.Provider
        value={{
          publisher: { queryRelatedArticlesStatus: jest.fn().mockResolvedValue({ related_article_items: [] }) },
          selectedItem: { id: 1 },
          tenants: [
            {
              name: 'tenant1', code: 'tenant1', paywall_enabled: true, fbia_enabled: false,
              routes: [
                { name: 'testroute1', id: 1 },
                { name: 'testroute2', id: 2 },
              ]
            },
            {
              name: 'tenant2', code: 'tenant2', paywall_enabled: true, fbia_enabled: false,
              routes: [
                { name: 'testroute1', id: 1 },
                { name: 'testroute2', id: 2 },
              ],
              content_lists: []
            }
          ]
        }}
      >
        <Publish
          destinations={destinations}
          openPreview={jest.fn()}
        />
      </Store.Provider>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it("adds Destination, updates list of available tenants, removes destination, updates list of available tenants", async () => {
    const toggle = jest.fn();

    const { container, getByText } = render(
      <Store.Provider
        value={{
          publisher: { queryRelatedArticlesStatus: jest.fn().mockResolvedValue({ related_article_items: [] }) },
          selectedItem: { id: 1 },
          tenants: [
            {
              name: 'tenant1', code: 'tenant1', paywall_enabled: true, fbia_enabled: false,
              routes: [
                { name: 'testroute1', id: 1 },
                { name: 'testroute2', id: 2 },
              ]
            },
            {
              name: 'tenant2', code: 'tenant2', paywall_enabled: true, fbia_enabled: false,
              routes: [
                { name: 'testroute1', id: 1 },
                { name: 'testroute2', id: 2 },
              ],
              content_lists: []
            }
          ]
        }}
      >
        <Publish
          destinations={destinations}
          openPreview={jest.fn()}
        />
      </Store.Provider>
    );

    // adds destination and updates available tenants
    let plusButton = container.querySelector(".btn--icon-only-circle");
    fireEvent.click(plusButton);

    const tenantButton = getByText('tenant2');
    fireEvent.click(tenantButton);

    expect(plusButton).toBeDisabled();


    // removes destination and updates available tenants
    const removeTenantButton = container.querySelector('[sd-tooltip="Remove tenant"]');

    fireEvent.click(removeTenantButton);
    expect(plusButton).not.toBeDisabled();
  });
});


