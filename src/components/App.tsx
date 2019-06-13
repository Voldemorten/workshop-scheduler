import * as React from "react";

import * as Logic from "../logic/logic";

export class App extends React.Component {
    render() {
        // Demo graph - self made
        //-----------------------------
        let students = require('../data/students.json').students;
        let timeslots = require('../data/timeslots.json').timeslots;
        let no_of_timeslots_per_day = 4;
        let penalty = Infinity;
        let opt_solution;
        //couldn't get deep copy to work...
        let org_graph = Logic.construct_graph(students, timeslots, no_of_timeslots_per_day);
        for(let i = 0; i<1; i++) {
            let g = Logic.construct_graph(students, timeslots, no_of_timeslots_per_day);
            let ff = Logic.compute_max_flow(g);
            if(ff.value == g['max_capacity']) {
                //output each solution
                let solution = Logic.convert_to_solution(g, true);
                console.log("Solution " + i + "\n------------------------");
                Logic.print_solution(solution);

                //used to find the best solution
                if(solution['penalty'] < penalty) {
                    penalty = solution['penalty'];
                    opt_solution = solution;
                }
            } else {
                console.log("No feasible solution");
                break;
            }
        }
        console.log("\nOptimal solution:\n------------------------");
        Logic.print_solution(opt_solution);
        
        //Random data
        //-----------------------------
        // for(let i = 0; i<10; i++) {
        //     let random_data = Logic.generate_random_data();
        //     let students = random_data["students"];
        //     let timeslots = random_data["timeslots"];
        //     let no_of_timeslots_per_day = random_data["no_of_timeslots_per_day"];
        //     let g = Logic.construct_graph(students, timeslots, no_of_timeslots_per_day);
        //     console.log(g);
        //     let ff = Logic.compute_max_flow(g);
        //     console.log(ff);
        //     let solution = Logic.convert_to_solution(g, false);
        //     console.log("Solution \n------------------------");
        //     Logic.print_solution(solution);
        // }


        return <h1>Hello</h1>;
    }
}