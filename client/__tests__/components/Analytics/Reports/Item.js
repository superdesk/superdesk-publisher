import React from "react";
import Item from "../../../../components/Analytics/Reports/Item";
import { render } from "@testing-library/react";

describe("Analytics/Reports/Item", () => {
  const item = {
    user: {
      username: "test buddy",
    },
    created_at: "2019-11-28T18:49:02+00:00",
    status: "completed",
    filters: {
      start: "2019-11-28T18:49:02+00:00",
      end: "2019-11-28T18:49:02+00:00"
    },
    _links: { download: { href: 'http://google.com' } }
  };

  it("renders correctly", () => {
    const { container } = render(<Item item={item} routes={[]} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
