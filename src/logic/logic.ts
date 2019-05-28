var jsgraphs = require('js-graph-algorithms');

export function construct_demo_graph() {
    let students = require('../data/students.json').students;
    let timeslots = require('../data/timeslots.json').timeslots;
        //node 0 should be source and node [student.length + timeslots.length + 2] should be sink
    let size = students.length + timeslots.length + 2
    let g = new jsgraphs.FlowNetwork(size);
    // console.log(g);
    //create edges from source to every student
    for(let i = 0; i<students.length; i++) {
        g.addEdge(new jsgraphs.FlowEdge(0, i+1, 100));
        // console.log("student: ", students[i]);
        for(let j = 0; j<students[i].preferences.length; j++) {
            //add edges from each student to every prefered timeslot
            // console.log("i: ",i," i+1: ", i+1);
            // console.log("j: ", j);
            // console.log("preference: ", students[i].preferences[j]);
            // console.log("students.length+students[i].preferences[j]: ", students.length+students[i].preferences[j]);
            g.addEdge(new jsgraphs.FlowEdge(i+1, students.length+students[i].preferences[j], 1));
        }
    }
    // add edges from timeslots to sink
    for(let k = 0; k<timeslots.length; k++) {
        // console.log(students.length+k+1," ", size-1, " ", timeslots[k].capacity);
        g.addEdge(new jsgraphs.FlowEdge(students.length+k+1, size-1, timeslots[k].capacity));
    }
    return g;
}

export function compute_max_flow(g: Object, source: number, sink: number) {
    return new jsgraphs.FordFulkerson(g, source, sink);
}

export function export_demo() {
    console.log("demo");
}

export default construct_demo_graph