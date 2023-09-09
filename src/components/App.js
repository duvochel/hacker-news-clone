import React, { Component } from "react";
import LinkList from "./LinkList";
import CreateLink from "./CreateLink";

class App extends Component {
  render() {
    return (
      <div className="mw5 mw7-ns center pa3 ph5-ns">
        <LinkList />
        <CreateLink />
      </div>
    );
  }
}

export default App;
