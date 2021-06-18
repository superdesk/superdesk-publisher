import React from "react";
import Tenant from "../../../components/Dashboard/Tenant";
import { render, fireEvent } from "@testing-library/react";

let tenant = {
  id: 1,
  subdomain: "site1",
  domain_name: "sourcefabric.org",
  name: "Site1",
  code: "site1",
  theme_name: "swp/daily-theme",
  amp_enabled: true,
  output_channel: null,
  pwa_config: { url: null },
  articles_count: 146,
  routes: [
    {
      id: 1,
      type: "collection",
      name: "sport",
      slug: "sport",
    },
    {
      id: 2,
      type: "collection",
      name: "business",
      slug: "business",
    },
  ],
  fbia_enabled: false,
  paywall_enabled: false,
  content_lists: [
    {
      id: 7,
      name: "Most shared",
    },
    {
      id: 8,
      name: "Most commented",
    },
  ],
};

describe("Dashboard/Tenant", () => {
  it("renders correctly", async () => {
    const { container } = render(<Tenant tenant={tenant} />);
    expect(container).toMatchSnapshot();
  });
});
