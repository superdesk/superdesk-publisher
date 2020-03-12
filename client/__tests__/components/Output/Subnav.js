import React from "react";
import Subnav from "../../../components/Output/Subnav";
import { render, fireEvent } from "@testing-library/react";
import Store from "../../../components/Output/Store";

const languages = [
  { qcode: 'pl', name: 'Polish' },
  { qcode: 'en', name: 'English' },
  { qcode: 'de', name: 'German' },
]

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
        <Subnav isLanguagesEnabled={true}
          languages={languages} />
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
        <Subnav isLanguagesEnabled={true}
          languages={languages} />
      </Store.Provider>
    );

    const button = getByText('Published');
    fireEvent.click(button);

    expect(setList).toHaveBeenCalled();
    expect(setList).toHaveBeenCalledWith("published");
  });
});
