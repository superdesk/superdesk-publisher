import React from "react";
import Automatic from "../../../../components/ContentLists/Automatic/Automatic";
import { render, wait } from "@testing-library/react";
import axios from "axios";
jest.mock("react-virtualized/styles.css", () => {
  return {};
});

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

describe("ContentLists/Automatic/Automatic", () => {
  it("renders properly", async () => {
    const { container, getByText } = render(
      <Automatic
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
