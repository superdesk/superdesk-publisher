import React from "react";
import AddWebsite from "../../../components/TargetedPublishing/AddWebsite";
import {
  render,
  fireEvent,
  wait,
  waitForElement,
} from "@testing-library/react";
import axios from "axios";

jest.mock("axios");

describe("TargetedPublishing/AddWebsite", () => {
  it("renders two tenants", async () => {
    const { getByText } = render(
      <AddWebsite
        setNewDestination={jest.fn()}
        apiUrl="example.com/"
        apiHeader={{ Authrization: "Basic 1234567" }}
        rules={[]}
      />
    );
    await wait(() => expect(getByText("TENANT1")).toBeInTheDocument());

    await wait(() => expect(getByText("TENANT2")).toBeInTheDocument());
  });

  it("filters tenants with rules - should render one tenant only", async () => {
    const { getByText, queryByText } = render(
      <AddWebsite
        setNewDestination={jest.fn()}
        apiUrl="example.com/"
        apiHeader={{ Authrization: "Basic 1234567" }}
        rules={[{ tenant: { id: 2 } }]}
      />
    );
    await wait(() => expect(getByText("TENANT1")).toBeInTheDocument());

    await wait(() => expect(queryByText("TENANT2")).not.toBeInTheDocument());
  });

  it("opens dropdown", async () => {
    const { container, getByTestId } = render(
      <AddWebsite
        setNewDestination={jest.fn()}
        apiUrl="example.com/"
        apiHeader={{ Authrization: "Basic 1234567" }}
        rules={[]}
      />
    );

    const button = await waitForElement(() =>
      container.querySelector("button")
    );

    fireEvent.click(button);
    expect(getByTestId("dropdown")).toHaveStyle(`max-height: 999px`);
  });

  it("fires setNewDestination", async () => {
    const setNewDestination = jest.fn();
    const { getByText } = render(
      <AddWebsite
        setNewDestination={setNewDestination}
        apiUrl="example.com/"
        apiHeader={{ Authrization: "Basic 1234567" }}
        rules={[]}
      />
    );
    const tenantItem = await waitForElement(() => getByText("TENANT1"));

    fireEvent.click(tenantItem);

    expect(setNewDestination).toHaveBeenCalled();
  });
});
