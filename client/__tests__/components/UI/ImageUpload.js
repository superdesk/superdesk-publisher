import React from "react";
import ImageUpload from "../../../components/UI/ImageUpload";
import { render, fireEvent } from "@testing-library/react";

describe("UI/ImageUpload", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ImageUpload
        upload={jest.fn()}
        fieldName={"test"}
        isUploadingInProgress={false}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders Loading indicator", () => {
    const { container } = render(
      <ImageUpload
        upload={jest.fn()}
        fieldName={"test"}
        isUploadingInProgress={true}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it("upload function fired", () => {
    const upload = jest.fn();
    const { container } = render(
      <ImageUpload
        upload={upload}
        fieldName={"test"}
        isUploadingInProgress={false}
      />
    );
    const input = container.querySelector('input[name="test"]');

    fireEvent.change(input, {
      target: {
        files: ["dummyValue.something"]
      }
    });

    expect(upload).toHaveBeenCalled();
  });
});
