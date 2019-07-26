import React, { Component } from "react";
import { DragDropContext } from "react-beautiful-dnd";

class App extends Component {
  onDragEnd = result => null;

  render() {
    return <DragDropContext onDragEnd={this.onDragEnd} />;
  }
}

export default App;
