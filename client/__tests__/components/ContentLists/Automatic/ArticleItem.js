import React from "react";
import ArticleItem from "../../../../components/ContentLists/Automatic/ArticleItem";
import { render } from "@testing-library/react";
import moment from 'moment';

jest.mock("moment", () => () => ({ fromNow: () => "2 days ago" }));

describe("ContentLists/Automatic/ArticleItem", () => {
  const item = {
    content: {
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
    }
  };

  it("renders correctly", () => {
    const { container } = render(
      <ArticleItem
        item={item}
        style={{}}
        openPreview={jest.fn()}
        previewItem={{}}
        pinUnpin={jest.fn()}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
