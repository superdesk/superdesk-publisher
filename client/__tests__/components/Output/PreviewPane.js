import React from "react";
import PreviewPane from "../../../components/Output/PreviewPane";
import { render, fireEvent } from "@testing-library/react";
import Store from "../../../components/Output/Store";

const _package = {
  "id": 641,
  "guid": "urn:newsml:sp-api.superdesk.pro:2019-09-24T16:37:56.756543:e027a313-b6ce-432b-91fa-45556e5ff1a8",
  "headline": "All during this wonderful May that we have been having",
  "byline": null,
  "slugline": null,
  "language": "en",
  "type": "text",
  "located": null,
  "urgency": 0,
  "priority": 5,
  "version": 3,
  "ednote": null,
  "description_text": "\"My dear boy,\" said Lord Henry, smiling, \"anybody can be good in the country. There are no temptations there. That is the reason why people who live out of town are so absolutely uncivilized. Civilization is not by any means an easy thing to attain.",
  "pubstatus": "usable",
  "evolvedfrom": null,
  "source": "Input",
  "firstpublished": "2019-09-24T14:44:16+0000",
  "copyrightnotice": null,
  "copyrightholder": null,
  "body_html": "<p>\"Culture and corruption,\" echoed Dorian. \"I have known something of both. It seems terrible to me now that they should ever be found together. For I have a new ideal, Harry. I am going to alter. I think I have altered.\"</p>\n<p>\"You have not yet told me what your good action was. Or did you say you had done more than one?\" asked his companion as he spilled into his plate a little crimson pyramid of seeded strawberries and, through a perforated, shell-shaped spoon, snowed white sugar upon them....",
  "created_at": "2019-09-24T14:44:30+00:00",
  "updated_at": "2019-10-21T13:15:00+00:00",
  "articles": [],
  "status": "published"
};

describe("Output/PreviewPane", () => {

  it("renders correctly", () => {
    const { container } = render(
      <Store.Provider
        value={{
          publisher: { getPackage: id => _package }
        }}
      >
        <PreviewPane package={_package} close={jest.fn()} />
      </Store.Provider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

});
