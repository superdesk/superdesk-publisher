import React from "react";
import PreviewStatusLabels from "../../../components/generic/PreviewStatusLabels";
import { render } from "@testing-library/react";

describe("generic/PreviewStatusLabels", () => {
  const articles = [{
    status: "published",
    tenant: { name: "testtenant", domain_name: "sourcefabric.org" },
    route: { name: "testroute" },
    _links: { online: { href: "/href" } }
  },
  {
    status: "new",
    tenant: { name: "testtenant2", domain_name: "sourcefabric.org" },
    route: { name: "testroute2" },
    _links: { online: { href: "/href" } }
  },
  {
    status: "unpublished",
    tenant: { name: "testtenant3", domain_name: "sourcefabric.org" },
    route: { name: "testroute3" },
    _links: { online: { href: "/href" } }
  },
  ];



  it("renders published article labels correctly", () => {
    const { container, getByText } = render(
      <PreviewStatusLabels
        articles={articles}
      />
    );

    expect(getByText("testtenant")).toBeInTheDocument();
    expect(getByText("testtenant2")).toBeInTheDocument();
    expect(getByText("testtenant3")).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });


});
