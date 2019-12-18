import React from "react";
import moment from "moment";
import ArticleItem from "../../../components/Output/ArticleItem";
import { render, fireEvent, waitForElement } from "@testing-library/react";
import Store from "../../../components/Output/Store";

const item = {
  "id": 686,
  "guid": "urn:newsml:sp-api.superdesk.pro:2019-11-28T19:44:39.315852:9517b504-ac24-48dd-8649-6d28b9038122",
  "headline": "Med test1.3",
  "slugline": null,
  "language": "en",
  "type": "text",
  "evolvedfrom": null,
  "firstpublished": "2019-11-28T18:48:56+0000",
  "extra_items": [],
  "body_html": "<p>test</p>",
  "feature_media": null,
  "created_at": "2019-11-28T18:49:02+00:00",
  "updated_at": "2019-11-28T18:53:11+00:00",
  "articles": [
    {
      "id": 2160,
      "title": "Med test1.3",
      "body": "<p>test</p>",
      "slug": "med-test1-3-vw6o03mj",
      "published_at": "2019-11-28T18:49:02+00:00",
      "status": "published",
      "route": "Object",
      "lead": "Med test1.3",
      "slideshows": [],
      "created_at": "2019-11-28T18:49:02+00:00",
      "updated_at": "2019-11-28T18:53:13+00:00",
      "seo_metadata": null,
      "feature_media": null,
      "is_published_fbia": false,
      "article_statistics": {
        "impressions_number": 0,
        "page_views_number": 4,
        "internal_click_rate": 0
      },
      "comments_count": 0,
      "tenant": { domain_name: "sourcefabric.org" },
      "_links": { online: { href: "/test" } },
      "live_url": "http://sourcefabric.org/sports/med-test1-3-vw6o03mj"
    }
  ],
  "status": "published",
  "comments_count": 0,
  "page_views_count": 4
};

moment.fromNow = () => '1 day ago';

describe("Output/ArticleItem", () => {


  it("renders correctly", () => {
    const { container } = render(
      <Store.Provider
        value={{
          publisher: {},
          selectedItem: null
        }}
      >
        <ArticleItem
          item={item}
          style={{}}
          onRemove={jest.fn()}
        />
      </Store.Provider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("fires confirmation modal and remove action", async () => {
    const onRemove = jest.fn();

    const { container, getByText, getBy } = render(
      <Store.Provider
        value={{
          publisher: { removeArticle: () => new Promise },
          selectedItem: null,
          selectedList: 'incoming'
        }}
      >
        <ArticleItem
          item={item}
          style={{}}
          onRemove={onRemove}
        />
      </Store.Provider>
    );
    const removeIcon = container.querySelector('button[sd-tooltip="Remove"]');
    fireEvent.click(removeIcon);

    const removeButton = await waitForElement(
      () => getByText("Remove")
    )
    fireEvent.click(removeButton);

    expect(onRemove).toHaveBeenCalled();
    expect(onRemove).toHaveBeenCalledWith(item.id);

  });
});
