import React from "react";
import TenantSelect from "../../../components/Output/TenantSelect";
import { render, fireEvent, wait } from "@testing-library/react";
import Store from "../../../components/Output/Store";


describe("Output/TenantSelect", () => {

  it("renders correctly", () => {
    const { container } = render(
      <Store.Provider
        value={{
          tenants: [
            { name: 'tenant1', code: 'tenant1' },
            { name: 'tenant2', code: 'tenant2' }
          ],
          filters: {},
          actions: { setFilters: jest.fn() }
        }}
      >
        <TenantSelect />
      </Store.Provider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("sets tenant", async () => {
    const setFilters = jest.fn();

    const { getByText } = render(
      <Store.Provider
        value={{
          tenants: [
            { name: 'tenant1', code: 'tenant1' },
            { name: 'tenant2', code: 'tenant2' }
          ],
          filters: {},
          actions: { setFilters: setFilters }
        }}
      >
        <TenantSelect />
      </Store.Provider>
    );

    const button = getByText('tenant2');
    fireEvent.click(button);

    expect(setFilters).toHaveBeenCalled();
    expect(setFilters).toHaveBeenCalledWith({ tenant: { name: 'tenant2', code: 'tenant2' } });
  });
});
