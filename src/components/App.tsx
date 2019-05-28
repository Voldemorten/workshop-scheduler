import * as React from "react";

import demo from "../logic/logic";

export class App extends React.Component {
    render() {
        demo();
        return <h1>Hello</h1>;
    }
}