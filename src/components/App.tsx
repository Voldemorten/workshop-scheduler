import * as React from "react";

import * as Logic from "../logic/logic";

export class App extends React.Component {
    render() {
        let g = Logic.construct_demo_graph();
        let ff = Logic.compute_max_flow(g, 0, 9);
        console.log(ff);
        return <h1>Hello</h1>;
    }
}