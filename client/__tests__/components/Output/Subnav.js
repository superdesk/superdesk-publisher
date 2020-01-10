import React from "react";
import Subnav from "../../../components/Output/Subnav";
import { render, fireEvent } from "@testing-library/react";
import Store from "../../../components/Output/Store";


describe("Output/Subnav", () => {

  it("renders correctly", () => {
    const { container } = render(
      <Store.Provider
        value={{
          articlesCounts: { incoming: 0, published: 0 },
          tenants: [
            { name: 'tenant1', code: 'tenant1' },
            { name: 'tenant2', code: 'tenant2' }
          ],
          filters: {},
          selectedList: 'incoming',
          actions: { setSelectedList: jest.fn() }
        }}
      >
        <Subnav />
      </Store.Provider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("sets selected list", async () => {
    const setList = jest.fn();

    const { getByText } = render(
      <Store.Provider
        value={{
          articlesCounts: { incoming: 0, published: 0 },
          tenants: [
            { name: 'tenant1', code: 'tenant1' },
            { name: 'tenant2', code: 'tenant2' }
          ],
          filters: {},
          selectedList: 'incoming',
          actions: { setSelectedList: setList }
        }}
      >
        <Subnav />
      </Store.Provider>
    );

    const button = getByText('Published');
    fireEvent.click(button);

    expect(setList).toHaveBeenCalled();
    expect(setList).toHaveBeenCalledWith("published");
  });
});
