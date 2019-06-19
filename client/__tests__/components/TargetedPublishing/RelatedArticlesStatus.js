import React from "react";
import RelatedArticlesStatus from "../../../components/TargetedPublishing/RelatedArticlesStatus";
import { render } from "@testing-library/react";
import axios from "axios";

jest.mock("axios");

describe("TargetedPublishing/RelatedArticlesStatus", () => {
  const item = {
    associations: true
  };

  const rules = [
    {
      tenant: {
        code: "eif0ca",
        subdomain: "tenant1",
        domain_name: "surcefabric.org"
      }
    }
  ];

  it("returns null when item has no associations", () => {
    const { container } = render(
      <RelatedArticlesStatus
        apiUrl="example.com/"
        apiHeader={{ Authrization: "Basic 1234567" }}
        rules={rules}
        item={{}}
      />
    );

    expect(container.firstChild).toBe(null);
  });

  it("renders correctly", async () => {
    const { container } = render(
      <RelatedArticlesStatus
        apiUrl="example.com/"
        apiHeader={{ Authrization: "Basic 1234567" }}
        rules={rules}
        item={item}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
