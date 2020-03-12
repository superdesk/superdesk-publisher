import React from "react";
import ErrorLog from "../../../components/ErrorLog/ErrorLog";
import { render, wait } from "@testing-library/react";

import Publisher from "../../../__mocks__/publisher";

const publisher = new Publisher();

describe("ErrorLog/ErrorLog", () => {
  it("renders correctly", async () => {
    const { container } = render(
      <ErrorLog publisher={publisher} />
    );

    await wait(() =>
      expect(container.querySelector(".sd-loader")).not.toBeInTheDocument(),
    )
    expect(container.firstChild).toMatchSnapshot();
  });
});
