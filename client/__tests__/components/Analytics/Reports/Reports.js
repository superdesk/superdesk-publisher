import React from "react";
import Reports from "../../../../components/Analytics/Reports/Reports";
import { render, waitForElement } from "@testing-library/react";

import Publisher from "../../../../__mocks__/publisher";

const publisher = new Publisher();

describe("Analytics/Reports/Reports", () => {
  it("renders correctly", async () => {
    const { container, getByText } = render(
      <Reports publisher={publisher} routes={[]} />
    );

    await waitForElement(() => getByText("test buddy"));
    expect(container.firstChild).toMatchSnapshot();
  });
});
