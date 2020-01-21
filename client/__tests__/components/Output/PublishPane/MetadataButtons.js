import React from "react";
import MetadataButtons from "../../../../components/Output/PublishPane/MetadataButtons";
import { render } from "@testing-library/react";

describe("Output/PublishPane/MetadataButtons", () => {
  it("renders properly", async () => {
    const { container } = render(
      <MetadataButtons
        open={jest.fn()}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
