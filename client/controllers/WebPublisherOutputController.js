/**
 * @ngdoc controller
 * @module superdesk.apps.web_publisher
 * @name WebPublisherOutputController
 * @requires publisher
 * @requires modal
 * @requires https://docs.angularjs.org/api/ng/type/$rootScope.Scope $scope
 * @description WebPublisherOutputController holds a set of functions used for web publisher output control
 */
import React from "react";
import ReactDOM from "react-dom";
import Output from "../components/Output/Output";

WebPublisherOutputController.$inject = [
  "$scope",
  "publisher",
  "authoringWorkspace",
  "vocabularies",
  "notify",
  "config",
  "api",
];
export function WebPublisherOutputController(
  $scope,
  publisher,
  authoringWorkspace,
  vocabularies,
  notify,
  config,
  api
) {
  class WebPublisherOutput {
    constructor() {
      this.editorOpen = false;
      let isLanguagesEnabled = false;

      vocabularies.getVocabularies().then((res) => {
        let languages = res.find((v) => v._id === "languages");
        languages =
          languages && languages.items
            ? languages.items.filter((l) => l.is_active)
            : [];

        if (languages.length > 1) {
          isLanguagesEnabled = true;
        }

        publisher.setTenant();

        ReactDOM.render(
          React.createElement(Output, {
            publisher: publisher,
            notify: notify,
            config: config,
            authoringWorkspace: authoringWorkspace,
            api: api,
            isLanguagesEnabled: isLanguagesEnabled,
            languages: languages,
          }),
          document.getElementById("sp-output-react-app")
        );
      });

      $scope.$watch(authoringWorkspace.getState, (state) => {
        this.editorOpen = state && state.item ? true : false;
        let event = new CustomEvent("isSuperdeskEditorOpen", {
          detail: this.editorOpen,
        });
        document.dispatchEvent(event);
      });
    }
  }

  return new WebPublisherOutput();
}
