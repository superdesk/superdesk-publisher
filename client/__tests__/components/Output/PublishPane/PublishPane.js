import React from "react";
import PublishPane from "../../../../components/Output/PublishPane/PublishPane";
import { render } from "@testing-library/react";
import Store from "../../../../components/Output/Store";

describe("Output/PublishPane/PublishPane", () => {

  it("renders correctly", () => {
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
        <PublishPane isOpen={true} />
      </Store.Provider>
    );
    expect(container.firstChild).toMatchSnapshot();

  });

});
