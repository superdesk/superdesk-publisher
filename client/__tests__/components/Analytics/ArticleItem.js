import React from "react";
import ArticleItem from "../../../components/Analytics/ArticleItem";
import { render } from "@testing-library/react";

describe("Analytics/ArticleItem", () => {
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

  it("renders correctly", () => {
    const { container } = render(<ArticleItem item={item} style={{}} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
