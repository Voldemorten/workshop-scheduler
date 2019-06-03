import * as React from "react";

import * as Logic from "../logic/logic";

export class App extends React.Component {
    render() {
        let penalty = Infinity;
        let opt_solution;
        let org_graph = Logic.construct_demo_graph();
        for(let i = 0; i<10; i++) {
            let g = org_graph;
            let ff = Logic.compute_max_flow(g, 0, 7 );
            console.log(ff);
            if(ff.value == g['max_capacity']) {
                //output each solution
                let solution = Logic.convert_to_solution(g);
                console.log("Solution " + i + "\n------------------------");
                Logic.print_solution(solution);

                //used to find the best solution
                if(solution['penalty'] < penalty) {
                    opt_solution = solution;
                }
            } else {
                console.log("No feasible solution");
                break;
            }
        }
        console.log("\nOptimal solution:\n------------------------");
        Logic.print_solution(opt_solution);

        return <h1>Hello</h1>;
    }
}