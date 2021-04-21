import React from "react";
import Listing from "../../../components/ContentLists/Listing";
import { render, fireEvent } from "@testing-library/react";

import Publisher from "../../../__mocks__/publisher";

const publisher = new Publisher();

jest.mock("moment", () => () => ({ fromNow: () => "2 days ago" }));

let lists = [];
publisher.queryLists().then((items) => (lists = items));

describe("ContentLists/Listing", () => {
  it("renders correctly", async () => {
    const { container, getByText } = render(
      <Listing
        publisher={publisher}
        lists={lists}
        onListDelete={jest.fn()}
        onListCreated={jest.fn()}
        onListUpdate={jest.fn()}
        addList={jest.fn()}
        listEdit={jest.fn()}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("addList fired", () => {
    const addList = jest.fn();

    const { container, getByText } = render(
      <Listing
        publisher={publisher}
        lists={lists}
        onListDelete={jest.fn()}
        onListCreated={jest.fn()}
        onListUpdate={jest.fn()}
        addList={addList}
        listEdit={jest.fn()}
      />
    );

    const button = getByText("Manual List");
    fireEvent.click(button);

    expect(addList).toHaveBeenCalled();
    expect(addList).toHaveBeenCalledWith("manual");
  });
});
