import React from "react";
import Analytics from "../../../components/Analytics/Analytics";
import { render, waitForElement } from "@testing-library/react";

jest.mock("react-virtualized/styles.css", () => {
  return {};
});

import Publisher from "../../../__mocks__/publisher";

const publisher = new Publisher();

describe("Analytics/Analytics", () => {
  it("renders correctly", async () => {
    const { container, getByText } = render(
      <Analytics publisher={publisher} />
    );
    let title = await waitForElement(() => getByText("Content Analytics"));
    expect(container.firstChild).toMatchSnapshot();
  });

  it("loads tenants", async () => {
    const { getByText } = render(<Analytics publisher={publisher} />);
    await waitForElement(() => getByText("Site1"));
  });
});
