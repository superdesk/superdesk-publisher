import React from "react";
import LanguageSelect from "../../../components/UI/LanguageSelect";
import { render, fireEvent, getByText } from "@testing-library/react";

const languages = [
  { qcode: 'pl', name: 'Polish' },
  { qcode: 'en', name: 'English' },
  { qcode: 'de', name: 'German' },
]

describe("UI/LanguageSelect", () => {
  it("renders correctly", () => {
    const { container, getByText } = render(
      <LanguageSelect languages={languages} selectedLanguageCode="en" setLanguage={jest.fn()} />
    );

    expect(getByText("Polish")).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });

  it("setLanguage function fired", () => {
    const setLanguage = jest.fn();
    const { getByText } = render(
      <LanguageSelect languages={languages} selectedLanguageCode="en" setLanguage={setLanguage} />
    );
    const button = getByText("Polish");

    fireEvent.click(button);
    expect(setLanguage).toHaveBeenCalled();
    expect(setLanguage).toHaveBeenCalledWith("pl");
  });
});
