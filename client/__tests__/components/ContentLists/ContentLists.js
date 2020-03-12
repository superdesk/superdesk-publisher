import React from "react";
import ContentLists from "../../../components/ContentLists/ContentLists";
import { render, waitForElement } from "@testing-library/react";
import axios from "axios";

jest.mock("react-virtualized/styles.css", () => {
  return {};
});

import Publisher from "../../../__mocks__/publisher";

const publisher = new Publisher();

jest.mock("axios");

jest.mock('moment', () => () => ({ fromNow: () => '2 days ago' }));

let api = () => { };

const languages = [
  { qcode: 'pl', name: 'Polish' },
  { qcode: 'en', name: 'English' },
  { qcode: 'de', name: 'German' },
]


describe("ContentLists/ContentLists", () => {
  it("renders properly", async () => {
    const { container, getByText } = render(
      <ContentLists tenant={null} list={null} api={api} publisher={publisher} isLanguagesEnabled={true}
        languages={languages} />
    );
    let title = await waitForElement(() => getByText("Content Lists"));
    expect(container.firstChild).toMatchSnapshot();
  });
});
