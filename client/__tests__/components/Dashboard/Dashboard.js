import React from "react";
import Dashboard from "../../../components/Dashboard/Dashboard";
import { render, wait } from "@testing-library/react";

import Publisher from "../../../__mocks__/publisher";

const publisher = new Publisher();


describe("Dashboard/Dashboard", () => {
  it("renders properly", async () => {
    const { container, getByText } = render(
      <Dashboard publisher={publisher} />
    );

    await wait(() =>
      expect(container.querySelector(".sd-loader")).not.toBeInTheDocument(),
    )

    expect(container).toMatchSnapshot();
  });
});
