import React from "react";
import ListCard from "../../../components/ContentLists/ListCard";
import { render, fireEvent } from "@testing-library/react";
import moment from 'moment';
import Publisher from "../../../__mocks__/publisher";

const publisher = new Publisher();

jest.mock("moment", () => () => ({ fromNow: () => "2 days ago" }));

let lists = [];
publisher.queryLists().then(items => (lists = items));

describe("ContentLists/ListCard", () => {
  it("renders correctly", async () => {
    const { container, getByText } = render(
      <ListCard publisher={publisher} list={lists[0]} listEdit={jest.fn()} onListCreated={jest.fn()} onListUpdate={jest.fn()}/>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("listEdit fired", () => {
    const listEdit = jest.fn();

    const { container, getByText } = render(
      <ListCard publisher={publisher} list={lists[0]} listEdit={listEdit} onListCreated={jest.fn()} onListUpdate={jest.fn()}/>
    );

    const button = getByText("Edit");
    fireEvent.click(button);

    expect(listEdit).toHaveBeenCalled();
    expect(listEdit).toHaveBeenCalledWith(lists[0]);
  });
});
