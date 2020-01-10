import React from "react";
import ArticlePreview from "../../../components/generic/ArticlePreview";
import { render } from "@testing-library/react";
import moment from "moment";

jest.mock('moment', () => () => ({ fromNow: () => '2 days ago', format: () => '2020–01–01T12:00:00+00:00' }));

const article = {
  article_statistics: {
    impressions_number: 0,
    internal_click_rate: 0,
    page_views_number: 0
  },
  body:
    "<p>I adore simple pleasures, said Lord Henry. They are the last refuge of the complex. But I don't like scenes, except on the stage. What absurd fellows you are, bot</p>",
  created_at: "2019–08–30T12:34:56+00:00",
  published_at: "2019–08–30T12:34:56+00:00",
  title: "If you let any one have it but me, Basil, I shall never forgive you",
  updated_at: "2019–08–30T12:34:56+00:00"
};

describe("generic/ArticlePreview", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ArticlePreview article={article} close={jest.fn()} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
