import React from "react";
import SortingOptions from "../../../components/Output/SortingOptions";
import { render, fireEvent } from "@testing-library/react";
import Store from "../../../components/Output/Store";


describe("Output/SortingOptions", () => {

  it("renders correctly", () => {
    const { container } = render(
      <Store.Provider
        value={{
          filters: { order: 'asc' },
          actions: { setFilters: jest.fn() }
        }}
      >
        <SortingOptions />
      </Store.Provider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("changes order", async () => {
    const setFilters = jest.fn();

    const { container } = render(
      <Store.Provider
        value={{
          filters: { order: 'asc' },
          actions: { setFilters: setFilters }
        }}
      >
        <SortingOptions />
      </Store.Provider>
    );
    const orderButton = container.querySelector('a.icn-btn .icon-ascending').closest('a.icn-btn');
    fireEvent.click(orderButton);

    expect(setFilters).toHaveBeenCalled();
    expect(setFilters).toHaveBeenCalledWith({ order: 'desc' });

  });

  it("changes sorting", async () => {
    const setFilters = jest.fn();

    const { getByText } = render(
      <Store.Provider
        value={{
          filters: { sort: 'updated_at' },
          actions: { setFilters: setFilters }
        }}
      >
        <SortingOptions />
      </Store.Provider>
    );
    const button = getByText('Created')
    fireEvent.click(button);

    expect(setFilters).toHaveBeenCalled();
    expect(setFilters).toHaveBeenCalledWith({ sort: 'created_at' });
  });
});
