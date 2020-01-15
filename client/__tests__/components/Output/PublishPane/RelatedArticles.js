import React from "react";
import RelatedArticles from "../../../../components/Output/PublishPane/RelatedArticles";
import { render } from "@testing-library/react";
import Store from "../../../../components/Output/Store";

const related_items = [
  { title: 'relatedArticle1', tenants: [{ code: 'tenant1', name: 'tenant1' }] },
  { title: 'relatedArticle2', tenants: [{ code: 'tenant2', name: 'tenant2' }] },
];


const destinations = [
  { status: "published", tenant: { code: 'tenant1', name: 'tenant1' } },
  { status: "published", tenant: { code: 'tenant2', name: 'tenant2' } }
];

describe("Output/PublishPane/RelatedArticles", () => {

  it("renders correctly", () => {
    const { container } = render(
      <Store.Provider
        value={{
          publisher: { queryRelatedArticlesStatus: id => related_items },
          selectedItemId: 1
        }}
      >
        <RelatedArticles destinations={destinations} />
      </Store.Provider>
    );
    expect(container.firstChild).toMatchSnapshot();

  });

});
