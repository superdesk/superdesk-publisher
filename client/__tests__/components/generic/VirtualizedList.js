import React from "react";
import VirtualizedList from "../../../components/generic/VirtualizedList";
import { render } from "@testing-library/react";

jest.mock("react-virtualized/styles.css", () => {
  return {};
});

describe("generic/VirtualizedList", () => {
  const itemRendered = () => <div>test</div>;

  it("renders correctly", () => {
    const { container } = render(
      <div style={{ width: "500px", height: "500px" }}>
        <VirtualizedList
          hasNextPage={false}
          isNextPageLoading={false}
          loadNextPage={jest.fn()}
          items={[{}, {}]}
          ItemRenderer={itemRendered}
        />
      </div>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
