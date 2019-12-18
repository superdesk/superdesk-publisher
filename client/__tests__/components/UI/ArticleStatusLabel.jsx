import React from "react";
import ArticleStatusLabel from "../../../components/UI/ArticleStatusLabel";
import { render } from "@testing-library/react";

describe("UI/ArticleStatusLabel", () => {
  const publishedArticle = {
    status: "published",
    tenant: { name: "testtenant" },
    route: { name: "testroute" }
  };

  const unpublishedArticle = {
    status: "unpublished",
    tenant: { name: "testtenant" },
    route: { name: "testroute" }
  };

  it("renders published article labels correctly", () => {
    const { container, getByText } = render(
      <ArticleStatusLabel
        article={publishedArticle}
        url="https://sourcefabric.org"
      />
    );

    expect(getByText("testtenant")).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders unpublished article labels correctly", () => {
    const { container, getByText } = render(
      <ArticleStatusLabel
        article={unpublishedArticle}
        url="https://sourcefabric.org"
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
