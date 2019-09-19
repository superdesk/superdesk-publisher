import React from "react";
import Slideshow from "../../../../components/UI/Slideshow/Slideshow.jsx";
import { render } from "@testing-library/react";

const tenant = { subdomain: "test", domain_name: "sourcefabric.org" };

const items = [
  {
    article_media: {
      id: 2634,
      image: {
        id: 2246
      },
      renditions: [
        {
          width: 1322,
          height: 955,
          name: "original",
          id: 24967,
          image: {
            id: 2246,
            file_extension: "jpeg",
            asset_id:
              "2019020713028_aac0d4a7f9a46fc7f22d7e6cb0487092b6db9b7cd3091029d01e5a1be58bde45"
          }
        }
      ]
    }
  },
  {
    article_media: {
      id: 2635,
      image: {
        id: 2280
      },
      renditions: [
        {
          width: 1920,
          height: 969,
          name: "original",
          id: 24968,
          image: {
            id: 2280,
            file_extension: "png",
            asset_id:
              "2019030620038_3e78ef460274a0e076ee7800f8f4463053a76dc3e38f645808c0bd69a2895f1e"
          }
        }
      ]
    }
  }
];

describe("UI/Slideshow", () => {
  it("renders correcty", () => {
    const { container } = render(<Slideshow tenant={tenant} items={items} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
