import React from "react";
import Manual from "../../../../components/ContentLists/Manual/Manual";
import { render, wait } from "@testing-library/react";
import axios from "axios";

import Publisher from "../../../../__mocks__/publisher";

const publisher = new Publisher();

jest.mock('moment', () => () => ({ fromNow: () => '2 days ago' }));

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
      />
    );

    await wait(() =>
      expect(container.querySelector(".sd-loader")).not.toBeInTheDocument(),
    )
    expect(container.firstChild).toMatchSnapshot();
  });
});
