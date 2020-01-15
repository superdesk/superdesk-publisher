import React from "react";
import OptionSwitches from "../../../../components/Output/PublishPane/OptionSwitches";
import { render } from "@testing-library/react";

const destination = {
  is_published_fbia: true,
  paywall_secured: false
};

describe("Output/PublishPane/OptionSwitches", () => {
  it("renders properly", async () => {
    const { container } = render(
      <OptionSwitches
        fbiaEnabled={true}
        paywallEnabled={true}
        destination={destination}
        onChange={jest.fn()}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
