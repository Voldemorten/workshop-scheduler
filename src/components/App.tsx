import {Container, Col, Row, Button} from 'react-bootstrap';

import * as React from "react";

import * as Flow from "../logic/flow";
import * as Greedy from "../logic/greedy";
import StudentTable from './StudentTable'
import UnassignedSchedule from './UnassignedSchedule';
import { transform } from '@babel/core';
import AssignedSchedule from './AssignedSchedule';

export class App extends React.Component<any, any> {
    constructor(props) {
        super(props);
        let input = Greedy.generate_random_data();
        console.log(input);
        this.state = {
          assigned: false,
          students: input["students"],
          timeslots: input["timeslots"],
          schedule: Greedy.construct_schedule(input["students"], input["timeslots"])
          //move everything to state
        };
  
        this.toggleAssigned = this.toggleAssigned.bind(this);
     }
  
     toggleAssigned() {
        this.setState(state => ({
          assigned: !state.assigned
        }));
     }
     
    render() {
        // let input = Greedy.generate_random_data()
        // this.setState(() => {
        //     return {students: input["students"], timeslots: input["timeslots"], schedule: input["schedule"], assigned: false}
        // })
        // Demo graph - self made
        //-----------------------------
        // let students = require('../data/students.json').students;
        // let timeslots = require('../data/timeslots.json').timeslots;
        // let no_of_timeslots_per_day = 4;
        // let opt_penalty = Infinity;
        // let opt_solution;
        // //couldn't get deep copy to work...
        // let org_graph = Flow.construct_graph(students, timeslots, no_of_timeslots_per_day);
        // for(let i = 0; i<10; i++) {
        //     let g = Flow.construct_graph(students, timeslots, no_of_timeslots_per_day);
        //     let ff = Flow.compute_max_flow(g);
        //     if(ff.value == g['max_capacity']) {
        //         console.log("Solution " + i + "\n------------------------");
        //         Flow.print_solution(g);
        //         let penalty = Flow.compute_penalty(g, true);
        //         if(penalty) console.error("penalty: ", penalty);
        //         else console.log("penalty: ", penalty);

        //         //used to find the best solution
        //         if(penalty < opt_penalty) {
        //             opt_penalty = penalty;
        //             opt_solution = g;
        //         }
        //     } else {
        //         console.log("No feasible solution");
        //         break;
        //     }
        // }
        // console.log("\nOptimal solution:\n------------------------");
        // Flow.print_solution(opt_solution);
        
        //Random data
        //-----------------------------
        // for(let i = 0; i<10; i++) {
        //     let random_data = Flow.generate_random_data();
        //     let students = random_data["students"];
        //     let timeslots = random_data["timeslots"];
        //     let no_of_timeslots_per_day = random_data["no_of_timeslots_per_day"];
        //     let g = Flow.construct_graph(students, timeslots, no_of_timeslots_per_day);
        //     console.log(g);
        //     let ff = Flow.compute_max_flow(g);
        //     console.log(ff);
        //     console.log("Solution \n------------------------");
        //     Flow.print_solution(g);
        //     let penalty = Flow.compute_penalty(g, true);
        //     if(penalty) console.error("penalty: ", penalty);
        //     else console.log("penalty: ", penalty);
        // }

        //Lets try a greedy aproach:
        // let students = require('../data/students.json').students6;
        // let timeslots = require('../data/timeslots.json').timeslots6;
        

        // console.log("Total capacity: ", total_capacity);
        // console.log("Total preferences: ", total_preferences);
        
        //generate empty schedule
        // let schedule = Greedy.construct_schedule(students, timeslots);
        // assign students to schedule
        // Greedy.assign_students(students, schedule);
        // if(Greedy.check_schedule(schedule)) {
            // console.log("Total penalty: ", Greedy.get_total_penalty(students));
        // };
        // Greedy.print_schedule(schedule);
        // Greedy.print_students(students);


        return (
            <Container style={containerStyle}>
                <Row>
                    <Col>
                        {this.state.students.length == 0 ?
                            <div>No students!</div>:
                            <StudentTable
                                students = {this.state.students}
                            ></StudentTable>
                        }
                        
                    </Col>
                    <Col>
                        <UnassignedSchedule
                            schedule = {this.state.schedule}
                        ></UnassignedSchedule>
                    </Col>
                </Row>
                <Row>
                    <Button 
                        style={blockButtonStyle}
                        variant="primary"
                        size="lg"
                        block
                        onClick={() => {
                            Greedy.assign_students(this.state.students, this.state.schedule)
                            this.toggleAssigned();
                        }}
                    >Assign students! 
                    </Button>
                </Row>
                <Row>
                    {/* <AssignedSchedule
                        isHidden = {!this.state.assigned}
                        schedule = {this.state.schedule}
                        students = {this.state.students}
                    ></AssignedSchedule> */}
                </Row>
            </Container>            
        );
    }
}

const blockButtonStyle = {
    width: "50%",
    margin: "50px auto"
}

const containerStyle = {
    margin: "50px auto"
}

// let input = Greedy.generate_random_data()
// let students = input["students"];
// let timeslots = input["timeslots"];
// let total_capacity = input["total_capacity"];
// let total_preferences = input["total_preferences"];
// let schedule = Greedy.construct_schedule(students, timeslots);