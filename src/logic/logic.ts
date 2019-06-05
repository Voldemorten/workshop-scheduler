const jsgraphs = require('./jsgraphs');

export function construct_demo_graph() {
    let students = require('../data/students.json').students;
    let timeslots = require('../data/timeslots.json').timeslots;
    let no_of_timeslots_per_day = 4;
    //node 0 should be source and node [student.length + timeslots.length + 2] should be sink
    let size = students.length + timeslots.length + 2
    let g = new jsgraphs.FlowNetwork(size);
    
    //to check if solution is feasible
    g.max_capacity = 0;

    //labeling
    g.node(0).label = "source";
    g.node(0).type = "source"
    g.node(size-1).label = "sink";
    g.node(size-1).type = "sink";
    
    //create edges from source to every student
    for(let i = 0; i<students.length; i++) {
        g.addEdge(new jsgraphs.FlowEdge(0, i+1, 100));
        
        //labeling 
        g.node(i+1).label = students[i].name;
        g.node(i+1).type = "student"
        g.edge(0, i+1).label = "From source to " + students[i].name;
        
        
        for(let j = 0; j<students[i].preferences.length; j++) {
            //add edges from each student to every prefered timeslot
            let timeslot_number = no_of_timeslots_per_day * students[i].preferences[j][0] + students[i].preferences[j][1] - no_of_timeslots_per_day;
            g.addEdge(new jsgraphs.FlowEdge(i+1, students.length + timeslot_number, 1));
            // labeling
            g.edge(i+1, students.length + timeslot_number).label = "From " + students[i].name + " to timeslot ["+students[i].preferences[j][0]+","+students[i].preferences[j][1]+"]";
        }
    }
    // add edges from timeslots to sink
    for(let k = 0; k<timeslots.length; k++) {
        g.max_capacity += timeslots[k].capacity; 

        g.addEdge(new jsgraphs.FlowEdge(students.length+k+1, size-1, timeslots[k].capacity));
        
        //labeling
        g.edge(students.length+k+1, size-1).label = "From timeslot [" + timeslots[k].day + "," + timeslots[k].timeslot + "] to sink";
        g.node(students.length+k+1).label = "timeslot [" + timeslots[k].day + "," + timeslots[k].timeslot + "] / " + (k+1) + " / " + (k+1+students.length);
        g.node(students.length+k+1).type = "timeslot";
        g.node(students.length+k+1).day = timeslots[k].day;
        g.node(students.length+k+1).timeslot = timeslots[k].timeslot;
    }
    return g;
}

export function compute_max_flow(g) {
    return new jsgraphs.FordFulkerson(g);
}

export function convert_to_solution(g) {
    let out = {}
    out["solution"] = {}
    out["penalty"] = 0;
    for(let i = 0; i<g.adjList.length; i++) {
        let adjlist = g.adjList[i];
        adjlist = adjlist.filter((e) => {
            return e.v == i && e.flow != 0 && g.node(e.v).type == "student";
        })
        // to compute penalty
        let end_nodes = [];
        for(let j = 0; j<adjlist.length; j++) {
                end_nodes.push(adjlist[j].w);
                let from = g.node(adjlist[j].v).label;
                let to = g.node(adjlist[j].w).label;
                if(!out["solution"][from]) {
                    out["solution"][from] = [to]
                } else {
                    out["solution"][from].push(to);
                }
        }

        for(let k = end_nodes.length-1; k>0; k--) {
            if (g.node(end_nodes[k]).day == g.node(end_nodes[k-1]).day) {
                let diff = end_nodes[k] - end_nodes[k-1];
                if (diff > 1) {
                    console.log("PENALTY!: ", end_nodes[k], " ", end_nodes[k-1])
                    out['penalty'] += diff-1;
                }
            }
        }
    }
    return out;
};

export function print_solution(solution) {
    console.table(solution['solution']);
    if(solution['penalty']>0) console.error("Penalty: " + solution['penalty'] + "\n\n");
    else console.log("Penalty: " + solution['penalty'] + "\n\n");
};

export default construct_demo_graph