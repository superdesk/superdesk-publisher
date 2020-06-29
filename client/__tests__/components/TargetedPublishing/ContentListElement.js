import React from "react";
import ContentListElement from "../../../components/TargetedPublishing/ContentListElement";
import { render, fireEvent } from "@testing-library/react";

describe("TargetedPublishing/ContentListElement", () => {
  const ruleLists = [
    {
      id: 1,
      position: 0
    }
  ];

  const list = {
    id: 1,
    position: 0
  };

  const allContentLists = [
    {
      content_list_items_count: 10,
      id: 1,
      name: "test1"
    },
    {
      content_list_items_count: 5,
      id: 2,
      name: "test2"
    }
  ];

  it("renders correctly", () => {
    const { container } = render(
      <ContentListElement
        removeList={jest.fn()}
        save={jest.fn()}
        index={0}
        ruleLists={ruleLists}
        list={list}
        allContentLists={allContentLists}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correct number of content lists to select", () => {
    const { container } = render(
      <ContentListElement
        removeList={jest.fn()}
        save={jest.fn()}
        index={0}
        ruleLists={ruleLists}
        list={list}
        allContentLists={allContentLists}
      />
    );

    const select = container.querySelector('select[name="id"]');

    // 2 content lists + 1 empty option = 3
    expect(select.childElementCount).toBe(3);
  });

  it("renders correct number of position options", () => {
    const { container } = render(
      <ContentListElement
        removeList={jest.fn()}
        save={jest.fn()}
        index={0}
        ruleLists={ruleLists}
        list={list}
        allContentLists={allContentLists}
      />
    );

    const select = container.querySelector('select[name="position"]');

    expect(select.childElementCount).toBe(10);
  });

  it("fires removeList with proper arguments", () => {
    const removeList = jest.fn();

    const { container } = render(
      <ContentListElement
        removeList={removeList}
        save={jest.fn()}
        index={0}
        ruleLists={ruleLists}
        list={list}
        allContentLists={allContentLists}
      />
    );

    const button = container.querySelector('a.icn-btn .icon-trash').closest('a.icn-btn');

    fireEvent.click(button);

    expect(removeList).toHaveBeenCalled();
    expect(removeList).toBeCalledWith(0);
  });

  it("fires save with proper arguments", () => {
    const save = jest.fn();

    const { container, getByText } = render(
      <ContentListElement
        removeList={jest.fn()}
        save={save}
        index={0}
        ruleLists={ruleLists}
        list={list}
        allContentLists={allContentLists}
      />
    );

    const select = container.querySelector('select[name="position"]');

    fireEvent.change(select, { target: { value: 4 } });

    expect(save).toHaveBeenCalled();
    expect(save).toBeCalledWith([
      {
        id: 1,
        position: 4
      }
    ]);
  });
});
