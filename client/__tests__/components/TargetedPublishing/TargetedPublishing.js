import React from "react";
import TargetedPublishing from "../../../components/TargetedPublishing/TargetedPublishing";
import { render } from "@testing-library/react";
import axios from "axios";

jest.mock("axios");

describe("TargetedPublishing/TargetedPublishing", () => {
  const rules = [
    {
      tenant: {
        code: "eif0ca",
        subdomain: "tenant1",
        domain_name: "sourcefabric.org",
        fbia_enabled: false,
        paywall_enabled: false,
        output_channel: false
      },
      route: {
        name: "route"
      },
      is_published_fbia: false,
      published: true,
      paywall_secured: false
    }
  ];

  const item = {
    guid: "asdfasdf87876876"
  };

  const config = {
    publisher: {
      protocol: "https"
    }
  };

  it('renders "no websites has been set" and AdddWebsite component', async () => {
    const { container, getByText } = render(
      <TargetedPublishing
        apiUrl="example.com/"
        apiHeader={{ Authrization: "Basic 1234567" }}
        item={item}
        reload={jest.fn()}
        config={config}
        rules={[]}
      />
    );

    const alert = container.querySelector(".tp-alert");

    expect(container.firstChild).toMatchSnapshot();
    expect(alert).toBeInTheDocument();
    expect(getByText("Add Website")).toBeInTheDocument();
  });

  it("renders destination", async () => {
    const { getAllByText } = render(
      <TargetedPublishing
        apiUrl="example.com/"
        apiHeader={{ Authrization: "Basic 1234567" }}
        item={item}
        reload={jest.fn()}
        config={config}
        rules={rules}
      />
    );

    expect(getAllByText("tenant1.sourcefabric.org")).toHaveLength(2);
  });
});
