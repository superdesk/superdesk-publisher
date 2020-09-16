import React from "react";
import RouteSelect from "../../../../components/Output/PublishPane/RouteSelect";
import { render } from "@testing-library/react";
import Store from "../../../../components/Output/Store";

const routes = [
  { id: 1, name: 'route1' },
  { id: 2, name: 'route2' },
  { id: 3, name: 'route3' }
];

describe("Output/PublishPane/RouteSelect", () => {
  it("renders properly", async () => {
    const { container, getByText } = render(
      <Store.Provider
        value={{
          config: { publisher: {} }
        }}
      >
        <RouteSelect
          routes={routes}
          selectedRouteId={1}
          onChange={jest.fn()}
        />
      </Store.Provider>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
