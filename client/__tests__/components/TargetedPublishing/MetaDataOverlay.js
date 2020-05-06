import React from "react";
import MetaDataOverlay from "../../../components/TargetedPublishing/MetaDataOverlay";
import { render, fireEvent } from "@testing-library/react";

describe("TargetedPublishing/MetaDataOverlay", () => {
  const metaData = {
    meta_title: null,
    meta_description: null,
    og_title: null,
    og_description: null,
    twitter_title: null,
    twitter_description: null
  };

  it("renders correctly", () => {
    const { container } = render(
      <MetaDataOverlay
        isOpen={true}
        toggle={jest.fn()}
        type={"Facebook"}
        metaData={metaData}
        setMetaData={jest.fn()}
        uploadImage={jest.fn()}
        isUploadingInProgress={false}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it("fires toggle", () => {
    const toggle = jest.fn();
    const { container } = render(
      <MetaDataOverlay
        isOpen={true}
        toggle={toggle}
        type={"Facebook"}
        metaData={metaData}
        setMetaData={jest.fn()}
        uploadImage={jest.fn()}
        isUploadingInProgress={false}
      />
    );

    fireEvent.click(container.querySelector('a[data-sd-tooltip="Back"]'));
    expect(toggle).toHaveBeenCalled();
  });

  it("fires uploadImage", () => {
    const uploadImage = jest.fn();
    const { container } = render(
      <MetaDataOverlay
        isOpen={true}
        toggle={jest.fn()}
        type={"Facebook"}
        metaData={metaData}
        setMetaData={jest.fn()}
        uploadImage={uploadImage}
        isUploadingInProgress={false}
      />
    );

    const input = container.querySelector('input[name="og_media_file"]');

    fireEvent.change(input, {
      target: {
        files: ["dummyValue.something"]
      }
    });
    expect(uploadImage).toHaveBeenCalled();
  });

  it("sets proper meta data", () => {
    const setMetaData = jest.fn();
    const { container } = render(
      <MetaDataOverlay
        isOpen={true}
        toggle={jest.fn()}
        type={"Facebook"}
        metaData={metaData}
        setMetaData={setMetaData}
        uploadImage={jest.fn()}
        isUploadingInProgress={false}
      />
    );

    fireEvent.change(container.querySelector('input[name="og_title"]'), {
      target: {
        value: "teststring"
      }
    });

    expect(setMetaData).toHaveBeenCalled();

    let newMetaData = { ...metaData };
    newMetaData.og_title = "teststring";

    expect(setMetaData).toHaveBeenCalledWith(newMetaData);
  });
});
