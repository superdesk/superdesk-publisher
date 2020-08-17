import React from "react";
import Manual from "../../../../components/ContentLists/Manual/Manual";
import { render, wait } from "@testing-library/react";

import Publisher from "../../../../__mocks__/publisher";

const publisher = new Publisher();

let lists = [];
publisher.queryLists().then(items => (lists = items));

jest.mock("axios");
jest.mock("react-select", () => props => "div");

let api = () => { };

api.users = {};
api.users.query = function () {
  return new Promise((resolve, reject) => {
    resolve({
      _items: [{ is_author: true, display_name: "test author" }],
      _links: {}
    });
  });
};

const languages = [
  { qcode: 'pl', name: 'Polish' },
  { qcode: 'en', name: 'English' },
  { qcode: 'de', name: 'German' },
]

describe("ContentLists/Manual/Manual", () => {
  it("renders properly", async () => {
    const { container } = render(
      <Manual
        list={lists[0]}
        lists={lists}
        publisher={publisher}
        listEdit={jest.fn()}
        onListUpdate={jest.fn()}
        api={api}
        toggleFilters={jest.fn()}
        isLanguagesEnabled={true}
        languages={languages}
        site={{ default_language: "en" }}
      />
    );

    await wait(() =>
      expect(container.querySelector(".sd-loader")).not.toBeInTheDocument(),
    )
    expect(container.firstChild).toMatchSnapshot();
  });
});
