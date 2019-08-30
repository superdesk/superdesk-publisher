import React from "react";
import Modal from "../../../components/UI/Modal";
import { render, fireEvent, getByText } from "@testing-library/react";

describe("UI/Modal", () => {
  it("renders itself, children correcty", () => {
    const { container, getByText } = render(
      <Modal isOpen={true}>
        <span>child</span>
      </Modal>
    );

    expect(getByText("child")).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });
});
