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
  "notify",
  "config"
];
export function WebPublisherOutputController(
  $scope,
  publisher,
  authoringWorkspace,
  notify,
  config
) {
  class WebPublisherOutput {
    constructor() {
      this.editorOpen = false;

      $scope.$watch(authoringWorkspace.getState, state => {
        this.editorOpen = state && state.item ? true : false;
      });

      ReactDOM.render(
        <Output
          publisher={publisher}
          notify={notify}
          config={config}
          isSuperdeskEditorOpen={this.editorOpen}
          authoringWorkspace={authoringWorkspace}
        />,
        document.getElementById("sp-output-react-app")
      );
    }
  }

  return new WebPublisherOutput();
}
