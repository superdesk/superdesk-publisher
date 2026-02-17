import React from "react";
import TargetedPublishing from "../../../components/TargetedPublishing/TargetedPublishing";
import { render, waitForElement } from "@testing-library/react";
import axios from "axios";

jest.mock("axios");

describe("TargetedPublishing/TargetedPublishing", () => {
  const rules = [
    {
      tenant: {
        code: "eif0ca",
        name: "TENANT1",
        subdomain: "tenant1",
        domain_name: "sourcefabric.org",
        fbia_enabled: false,
        paywall_enabled: false,
        output_channel: false,
      },
      route: {
        name: "route",
      },
      is_published_fbia: false,
      published: true,
      paywall_secured: false,
    },
  ];

  const item = {
    guid: "asdfasdf87876876",
  };

  const config = {
    publisher: {
      protocol: "https",
    },
  };

  it('renders "no websites has been set" and AdddWebsite component', async () => {
    // Mock axios to return sites data so AddWebsite component can render the button.
    // AddWebsite fetches sites via axios.get() in componentDidMount and only shows
    // the "Add website" button if there are available sites.
    axios.get = jest.fn().mockResolvedValue({
      data: {
        _embedded: {
          _items: [
            { id: 1, name: "Test Site", code: "test" }
          ]
        }
      }
    });

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

    // Wait for button to appear after async site fetch completes
    await waitForElement(() => getByText("Add website"));
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

    expect(getAllByText("TENANT1")).toHaveLength(2);
  });
});
