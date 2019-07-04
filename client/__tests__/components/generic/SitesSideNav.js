import React from "react";
import SitesSideNav from "../../../components/generic/SitesSideNav";
import {
  render,
  fireEvent,
  wait,
  waitForElement
} from "@testing-library/react";

const sites = [
  {
    code: "1",
    name: "site1"
  },
  {
    code: "2",
    name: "site2"
  }
];

const selectedSite = {
  code: "2",
  name: "site2"
};

describe("generic/SitesSideNav", () => {
  it("renders correctly open", () => {
    const { container } = render(
      <SitesSideNav
        toggle={jest.fn()}
        setTenant={jest.fn()}
        open={true}
        sites={sites}
        selectedSite={selectedSite}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly closed", () => {
    const { container } = render(
      <SitesSideNav
        toggle={jest.fn()}
        setTenant={jest.fn()}
        open={false}
        sites={sites}
        selectedSite={selectedSite}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it("fires toggle", async () => {
    const toggle = jest.fn();

    const { container } = render(
      <SitesSideNav
        toggle={toggle}
        setTenant={jest.fn()}
        open={false}
        sites={sites}
        selectedSite={selectedSite}
      />
    );

    const button = container.querySelector("button.nav-tabs-vertical__link");

    fireEvent.click(button);
    expect(toggle).toHaveBeenCalled();
  });
});
