import React from "react";
import FiltersPanel from "../../../components/Analytics/FiltersPanel";
import { render, fireEvent } from "@testing-library/react";

let api = () => {};

jest.mock("../../../components/UI/MultiSelect", () => () => {
  return <div></div>;
});

api.users = {};
api.users.query = function () {
  return new Promise((resolve, reject) => {
    resolve({
      _items: [{ is_author: true, display_name: "author" }],
      _links: {},
    });
  });
};

describe("Analytics/FiltersPanel", () => {
  const filters = {
    route: 1,
    published_after: "2019-07-04",
    published_before: "2019-07-04",
  };

  const routes = [
    {
      id: 1,
      name: "testroute",
    },
  ];

  it("renders correctly", () => {
    const { container } = render(
      <FiltersPanel
        toggle={jest.fn()}
        filters={filters}
        setFilters={jest.fn()}
        routes={routes}
        api={api}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it("fires toggle", async () => {
    const toggle = jest.fn();

    const { container } = render(
      <FiltersPanel
        toggle={toggle}
        filters={{}}
        setFilters={jest.fn()}
        routes={[]}
        api={api}
      />
    );

    const button = container.querySelector(".side-panel__close button");

    fireEvent.click(button);
    expect(toggle).toHaveBeenCalled();
  });

  it("updates and sets filters", () => {
    const setFilters = jest.fn();

    const { container, getByText } = render(
      <FiltersPanel
        toggle={jest.fn()}
        filters={filters}
        setFilters={setFilters}
        routes={routes}
        api={api}
      />
    );

    const filterButton = getByText("Run Report");
    fireEvent.click(filterButton);

    expect(setFilters).toHaveBeenCalled();
    expect(setFilters).toHaveBeenCalledWith(filters);
  });

  it("clears filters", () => {
    const setFilters = jest.fn();

    const { getByText } = render(
      <FiltersPanel
        toggle={jest.fn()}
        filters={filters}
        setFilters={setFilters}
        routes={routes}
        api={api}
      />
    );

    const button = getByText("Clear");
    fireEvent.click(button);

    expect(setFilters).toHaveBeenCalled();
    expect(setFilters).toHaveBeenCalledWith({});
  });
});
