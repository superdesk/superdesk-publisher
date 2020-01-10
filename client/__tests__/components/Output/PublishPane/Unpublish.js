import React from "react";
import Unpublish from "../../../../components/Output/PublishPane/Unpublish";
import { render, wait } from "@testing-library/react";
import Store from "../../../../components/Output/Store";

const destinations = [
  { status: "published", tenant: { code: 'tenant1', name: 'tenant1' } },
  { status: "published", tenant: { code: 'tenant2', name: 'tenant2' } }
];

describe("Output/PublishPane/Unpublish", () => {
  it("renders properly", async () => {
    const { container, getByText } = render(
      <Store.Provider
        value={{
          publisher: {},
          selectedItem: { id: 1 }
        }}
      >
        <Unpublish
          destinations={destinations}
        />
      </Store.Provider>
    );

    await wait(() =>
      expect(container.querySelector(".sd-loader")).not.toBeInTheDocument(),
    )

    expect(container.firstChild).toMatchSnapshot();
  });
});
