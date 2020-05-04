import React from "react";
import Output from "../../../components/Output/Output";
import { render, wait } from "@testing-library/react";
import Publisher from "../../../__mocks__/publisher";

const publisher = new Publisher();

jest.mock("react-virtualized/styles.css", () => {
  return {};
});
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

describe("Output/Output", () => {
  it("renders properly", async () => {
    const { container } = render(
      <Output
        publisher={publisher}
        notify={{ error: jest.fn() }}
        config={{}}
        authoringWorkspace={{}}
        api={api}
        isLanguagesEnabled={true}
        languages={languages}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
