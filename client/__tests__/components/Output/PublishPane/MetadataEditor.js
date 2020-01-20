import React from "react";
import MetadataEditor from "../../../../components/Output/PublishPane/MetadataEditor";
import { render } from "@testing-library/react";


const destination = {
  seo_metadata: {
    meta_title: 'the title',
    meta_description: 'the description'
  }
}

describe("Output/PublishPane/MetadataEditor", () => {

  it("renders correctly", async () => {
    const { container, getByText } = render(

      <MetadataEditor
        isOpen={true}
        destination={destination}
        close={jest.fn()}
        type="SEO"
      />

    );

    expect(container.firstChild).toMatchSnapshot();
  });

});
