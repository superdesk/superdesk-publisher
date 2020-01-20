import React from "react";
import Preview from "../../../../components/Output/PublishPane/Preview";
import { render, wait } from "@testing-library/react";
import Store from "../../../../components/Output/Store";

const item = {
  tenant: { domain_name: 'test.com' },
  route: { id: 1 }
}

describe("Output/PublishPane/Preview", () => {

  it("renders correctly", async () => {
    const { container, } = render(
      <Store.Provider
        value={{
          publisher: { getToken: () => '123' },
          selectedItem: { id: 1 }
        }}
      >
        <Preview
          isOpen={true}
          item={item}
          close={jest.fn()}
        />
      </Store.Provider>
    );





    expect(container.firstChild).toMatchSnapshot();
  });

});
