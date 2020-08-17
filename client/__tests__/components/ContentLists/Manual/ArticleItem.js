import React from "react";
import ArticleItem from "../../../../components/ContentLists/Manual/ArticleItem";
import { render } from "@testing-library/react";

describe("ContentLists/Manual/ArticleItem", () => {
  const item = {
    title: "test",
    route: {
      name: "route"
    },
    authors: [{ name: "author" }],
    published_at: "2017-07-26T13:43:33+00:00",
    article_statistics: {
      page_views_number: 10,
      internal_click_rate: 5,
      impressions_number: 15
    }
  };

  it("renders correctly without extras", () => {
    const { container } = render(
      <ArticleItem
        item={item}
        openPreview={jest.fn()}
        previewItem={{}}
        index={1}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly with extras", () => {
    const { container } = render(
      <ArticleItem
        item={item}
        openPreview={jest.fn()}
        previewItem={{}}
        showExtras={true}
        index={1}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

});
