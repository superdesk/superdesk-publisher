import React from "react";
import ArticlePreview from "../../../components/generic/ArticlePreview";
import { render } from "@testing-library/react";
import moment from "moment";

const article = {
  article_statistics: {
    impressions_number: 0,
    internal_click_rate: 0,
    page_views_number: 0
  },
  body:
    "<p>I adore simple pleasures, said Lord Henry. They are the last refuge of the complex. But I don't like scenes, except on the stage. What absurd fellows you are, bot</p>",
  created_at: moment()
    .subtract(2, "days")
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .format(),
  published_at: moment()
    .subtract(2, "days")
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .format(),
  title: "If you let any one have it but me, Basil, I shall never forgive you",
  updated_at: moment()
    .subtract(2, "days")
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .format()
};

describe("generic/ArticlePreview", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ArticlePreview article={article} close={jest.fn()} />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
