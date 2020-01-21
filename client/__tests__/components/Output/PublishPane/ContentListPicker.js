import React from "react";
import ContentListPicker from "../../../../components/Output/PublishPane/ContentListPicker";
import { render } from "@testing-library/react";

const destination = {
  tenant: {
    code: 'tenant1',
    content_lists: [
      { type: "manual", id: 1, name: 'list1', content_list_items_count: 10 },
      { type: "automatic", id: 2, name: 'listAutomatic' },
      { type: "manual", id: 3, name: 'list3', content_list_items_count: 2 },
      { type: "manual", id: 4, name: 'list4', content_list_items_count: 0 }
    ]
  },
  content_lists: [
    { id: 1, position: 0 },
    { id: 3, position: 0 }
  ]
};

describe("Output/PublishPane/ContentListPicker", () => {
  it("renders properly", async () => {
    const { container } = render(
      <ContentListPicker
        destination={destination}
        update={jest.fn()}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it("remainingLists are filtered correctly", async () => {
    const { getByText } = render(
      <ContentListPicker
        destination={destination}
        update={jest.fn()}
      />
    );

    expect(getByText('Add to content list')).toBeInTheDocument();
  });
});
