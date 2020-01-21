import React from "react";
import Analytics from "../../../components/Analytics/Analytics";
import { render, waitForElement } from "@testing-library/react";

jest.mock("react-virtualized/styles.css", () => {
  return {};
});

jest.mock("../../../components/UI/MultiSelect", () => () => {
  return (<div></div>)
});

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

import Publisher from "../../../__mocks__/publisher";

const publisher = new Publisher();

describe("Analytics/Analytics", () => {
  it("renders correctly", async () => {
    const { container, getByText } = render(
      <Analytics publisher={publisher} api={api} />
    );
    let title = await waitForElement(() => getByText("Content Analytics"));
    expect(container.firstChild).toMatchSnapshot();
  });

  it("loads tenants", async () => {
    const { getByText } = render(<Analytics publisher={publisher} api={api} />);
    await waitForElement(() => getByText("Site1"));
  });
});
