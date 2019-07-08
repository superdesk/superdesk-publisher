import React from "react";
import FiltersPanel from "../../../components/Analytics/FiltersPanel";
import { render, fireEvent } from "@testing-library/react";

describe("Analytics/FiltersPanel", () => {
  const filters = {
    route: 1,
    author: "author",
    published_after: "2019-07-04",
    published_before: "2019-07-04"
  };

  const routes = [
    {
      id: 1,
      name: "testroute"
    }
  ];

  it("renders correctly", () => {
    const { container } = render(
      <FiltersPanel
        toggle={jest.fn()}
        filters={filters}
        setFilters={jest.fn()}
        routes={routes}
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
      />
    );

    const button = container.querySelector(".side-panel__close");

    fireEvent.click(button);
    expect(toggle).toHaveBeenCalled();
  });

  it("updates and sets filters", () => {
    const setFilters = jest.fn();

    const { container, getByTestId } = render(
      <FiltersPanel
        toggle={jest.fn()}
        filters={filters}
        setFilters={setFilters}
        routes={routes}
      />
    );

    const input = container.querySelector('input[name="author"]');
    fireEvent.change(input, { target: { value: "testauthor" } });

    const filterButton = getByTestId("filterSave");
    fireEvent.click(filterButton);

    expect(setFilters).toHaveBeenCalled();

    let newFilters = { ...filters };
    newFilters.author = "testauthor";

    expect(setFilters).toHaveBeenCalledWith(newFilters);
  });

  it("clears filters", () => {
    const setFilters = jest.fn();

    const { container, getByTestId } = render(
      <FiltersPanel
        toggle={jest.fn()}
        filters={filters}
        setFilters={setFilters}
        routes={routes}
      />
    );

    const input = container.querySelector('input[name="author"]');
    fireEvent.change(input, { target: { value: "testauthor" } });

    const button = getByTestId("filterClear");
    fireEvent.click(button);

    expect(setFilters).toHaveBeenCalled();
    expect(setFilters).toHaveBeenCalledWith({});
  });
});
