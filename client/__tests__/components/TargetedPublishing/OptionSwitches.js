import React from "react";
import OptionSwitches from "../../../components/TargetedPublishing/OptionSwitches";
import {
  render,
  fireEvent,
  waitForElement,
  wait
} from "@testing-library/react";

describe("TargetedPublishing/OptionSwitches", () => {
  const destination = {
    is_published_fbia: true,
    paywall_secured: true
  };

  it("returns null when both options are disabled", () => {
    const { container } = render(
      <OptionSwitches
        fbiaEnabled={false}
        paywallEnabled={false}
        destination={destination}
        onChange={jest.fn()}
      />
    );

    expect(container.firstChild).toBe(null);
  });

  it("renders both switches", async () => {
    const { getByText } = render(
      <OptionSwitches
        fbiaEnabled={true}
        paywallEnabled={true}
        destination={destination}
        onChange={jest.fn()}
      />
    );

    await waitForElement(() => getByText("Facebook"));
    await waitForElement(() => getByText("Paywall Secured"));
  });

  it("renders facebook switch only", async () => {
    const { getByText, queryByText } = render(
      <OptionSwitches
        fbiaEnabled={true}
        paywallEnabled={false}
        destination={destination}
        onChange={jest.fn()}
      />
    );

    await waitForElement(() => getByText("Facebook"));
    await wait(() =>
      expect(queryByText("Paywall Secured")).not.toBeInTheDocument()
    );
  });

  it("renders paywall switch only", async () => {
    const { getByText, queryByText } = render(
      <OptionSwitches
        fbiaEnabled={false}
        paywallEnabled={true}
        destination={destination}
        onChange={jest.fn()}
      />
    );

    await waitForElement(() => getByText("Paywall Secured"));
    await wait(() => expect(queryByText("Facebook")).not.toBeInTheDocument());
  });

  it("fires onChange", async () => {
    const onChange = jest.fn();

    const { container } = render(
      <OptionSwitches
        fbiaEnabled={true}
        paywallEnabled={true}
        destination={destination}
        onChange={onChange}
      />
    );

    const checkbox = await waitForElement(() =>
      container.querySelector(".sd-checkbox")
    );

    fireEvent.click(checkbox);

    expect(onChange).toHaveBeenCalled();
  });
});
