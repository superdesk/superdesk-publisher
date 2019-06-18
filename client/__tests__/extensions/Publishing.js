import React from "react";
import Publishing from "../../extensions/Publishing";
import { render } from "@testing-library/react";
import axios from "axios";

jest.mock("axios");

describe("extensions/Publishing", () => {
  const item = {
    guid: "asdfasdf87876876"
  };

  const config = {
    publisher: {
      protocol: "https"
    }
  };

  const session = {
    id: "asdfasdf",
    token: "asdfasdf"
  };

  let api = () => {};

  api.query = function() {
    return new Promise((resolve, reject) => {
      resolve({ _items: [] });
    });
  };

  const urls = {
    item: () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("example.com/formatter");
        }, 100);
      });
    }
  };

  it("renders properly", async () => {
    global.fetch = jest.fn(
      () =>
        new Promise(resolve =>
          resolve({
            ok: true,
            status: 200,
            json: () => {},
            text: () =>
              new Promise((resolve, reject) => {
                resolve('{"guid": "asdfasdf"}');
              })
          })
        )
    );

    const { container } = render(
      <Publishing
        config={config}
        api={api}
        item={item}
        urls={urls}
        session={session}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
