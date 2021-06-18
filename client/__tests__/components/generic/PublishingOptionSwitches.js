import React from "react";
import PublishingOptionsSwithces from "../../../components/generic/PublishingOptionSwitches";
import {
  render,
  fireEvent,
  waitForElement,
  wait,
} from "@testing-library/react";

describe("generic/PublishingOptionsSwithces", () => {
  const destination = {
    is_published_fbia: true,
    paywall_secured: true,
  };

  it("returns null when all options are disabled", () => {
    const { container } = render(
      <PublishingOptionsSwithces
        fbiaEnabled={false}
        paywallEnabled={false}
        appleNewsEnabled={false}
        destination={destination}
        onChange={jest.fn()}
      />
    );

    expect(container.firstChild).toBe(null);
  });

  it("renders all switches", async () => {
    const { getByText } = render(
      <PublishingOptionsSwithces
        fbiaEnabled={true}
        paywallEnabled={true}
        appleNewsEnabled={true}
        destination={destination}
        onChange={jest.fn()}
      />
    );

    await waitForElement(() => getByText("FBIA"));
    await waitForElement(() => getByText("Paywall"));
    await waitForElement(() => getByText("Apple News"));
  });

  it("renders fbia switch only", async () => {
    const { getByText, queryByText } = render(
      <PublishingOptionsSwithces
        fbiaEnabled={true}
        paywallEnabled={false}
        appleNewsEnabled={false}
        destination={destination}
        onChange={jest.fn()}
      />
    );

    await waitForElement(() => getByText("FBIA"));
    await wait(() => expect(queryByText("Paywall")).not.toBeInTheDocument());
  });

  it("renders paywall switch only", async () => {
    const { getByText, queryByText } = render(
      <PublishingOptionsSwithces
        fbiaEnabled={false}
        paywallEnabled={true}
        appleNewsEnabled={false}
        destination={destination}
        onChange={jest.fn()}
      />
    );

    await waitForElement(() => getByText("Paywall"));
    await wait(() => expect(queryByText("FBIA")).not.toBeInTheDocument());
  });

  it("fires onChange", async () => {
    const onChange = jest.fn();

    const { container } = render(
      <PublishingOptionsSwithces
        fbiaEnabled={true}
        paywallEnabled={true}
        appleNewsEnabled={true}
        destination={destination}
        onChange={onChange}
      />
    );

    const checkbox = await waitForElement(() =>
      container.querySelector(".sd-check-new__input")
    );

    fireEvent.click(checkbox);

    expect(onChange).toHaveBeenCalled();
  });
});
