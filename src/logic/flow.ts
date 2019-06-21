const jsgraphs = require('./jsgraphs');

export function generate_random_data() {
    let out = {}
    let no_of_students = Math.floor(Math.random() * (100 - 50 + 1)) + 50; //between 50 and 100;
    let no_of_timeslots_per_day = Math.floor(Math.random() * (5 - 3 + 1)) + 3; //between 3 and 5;
    let no_of_days = Math.floor(Math.random() * (5 - 3 + 1)) + 3; //between 3 and 5;
    let timeslots_length = Math.floor(Math.random() * (3 - 1 + 1)) + 1; //between 1 and 3;
    let start_time = 8
    let max_preferences = Math.floor(Math.random() * (no_of_days*no_of_timeslots_per_day));
    let names = require('../data/names.json').names;

    console.log(`Random generated data... No of students: ${no_of_students}, No of days: ${no_of_days}, No of timeslots per day: ${no_of_timeslots_per_day}, length of timeslots: ${timeslots_length}`);
    //generate timeslots
    let timeslots = [];
    for(let day = 1; day<no_of_days+1; day++) {
        for(let timeslot = 1; timeslot<no_of_timeslots_per_day+1; timeslot++) {
            // max = no of students / no of timeslots
            let capacity = Math.floor(Math.random() * ((no_of_students*max_preferences/4)/(no_of_timeslots_per_day*no_of_days) - 1 + 1)) + 1;
            let new_timeslot = {"day": day, "timeslot": timeslot, "capacity": capacity, "time": start_time+(timeslot-1)*timeslots_length+":00-"+(start_time+timeslot*timeslots_length)+":00" };
            timeslots.push(new_timeslot);
        }
    }
    //generate students
    let students = [];
    for(let i = 0; i<no_of_students; i++) {
        let name = names[i];
        let no_of_preferences = Math.floor(Math.random()* (max_preferences));
        var preferences = [];    
        for(let j = 0; j<no_of_preferences; j++) {
            do {
                let day = Math.floor(Math.random() * (no_of_days)) + 1;
                let timeslot = Math.floor(Math.random()* (no_of_timeslots_per_day))+1;
                var new_preference = [day, timeslot];
                var preferences_string = preferences.map((e) => {
                    return JSON.stringify(e);
                }); 
                var new_preference_string = JSON.stringify(new_preference);
            } while (preferences_string.indexOf(new_preference_string)>=0)
            preferences.push(new_preference);
        }
        //sorting preferences
        preferences = preferences.sort((a, b) => {
            if(a[0] == b[0]) {
                return a[1] - b[1];
            } return a[0] - b[0];
        });

        let new_student = {"name": name, "preferences": preferences, "no": i+1};
        students.push(new_student);
    }
    out["timeslots"] = timeslots;
    out["students"] = students;
    out["no_of_timeslots_per_day"] = no_of_timeslots_per_day;
    return out;
}

export function construct_graph(students, timeslots, no_of_timeslots_per_day) {
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
        g.addEdge(new jsgraphs.FlowEdge(0, i+1, Infinity));
        
        //labeling 
        g.node(i+1).label = students[i].name;
        g.node(i+1).type = "student";
        g.node(i+1).student_no = i+1;
        g.node(i+1).preferences = students[i].preferences;
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

export function compute_penalty(g, debug) {
    let penalty_edges = []
    let penalty_edge;
    while(penalty_edge = find_penalty_edge(g, penalty_edges)) {
        // console.log(g.edge(penalty_edge[0],penalty_edge[1]));
        //get incoming edges
        let incoming_edges = g.adj(penalty_edge[1]).filter((e) => {
            return e.w == penalty_edge[1];
        });
        // console.log(g.adj(penalty_edge[1]));
        // console.log(incoming_edges);
        penalty_edges.push(penalty_edge);
    }
    return penalty_edges.length;
}

function find_penalty_edge(g, penalty_edges) {
    for(let i = 0; i<g.adjList.length; i++) {
        let adjlist = g.adj(i);
        adjlist = adjlist.filter((e) => {
            return e.from() == i && e.flow != 0 && g.node(e.from()).type == "student";
        })
        // to compute penalty
        if(adjlist.length > 0) {
            var from = adjlist[0].from(); //the student that is assigned
            for(let k = adjlist.length-1; k>0; k--) {
                let end_node = adjlist[k].to()
                let neighbor_end_node = adjlist[k-1].to()
                //must be same day
                if (g.node(end_node).day == g.node(neighbor_end_node).day) {
                    let diff = end_node - neighbor_end_node;
                    if (diff > 1) {
                        //check if the diff is in the students preferences:
                        for(let i = diff-1; i>0; i--) {
                            //hacky way to search for a preference
                            let preferencesString = g.node(from).preferences.map(JSON.stringify);
                            let timeslotString = JSON.stringify([g.node(end_node-i).day, g.node(end_node-i).timeslot]);
                            if(preferencesString.indexOf(timeslotString) >= 0) {
                                console.log(`there should be flow between node  no ${from} and ${end_node-i}`);
                                let penalty_edges_string = penalty_edges.map(JSON.stringify);
                                let new_penalty_edge = [from, end_node-i];
                                let penalty_edge_string = JSON.stringify(new_penalty_edge);
                                if(penalty_edges_string.indexOf(penalty_edge_string) == -1) {
                                    return new_penalty_edge;
                                } else continue;
                            }
                        }
                    }
                }
            }
        }
    }
    return false;
}

export function print_solution(g) {
    let solution = {}
    for(let i = 0; i<g.adjList.length; i++) {
        let adjlist = g.adjList[i];
        adjlist = adjlist.filter((e) => {
            return e.from() == i && e.flow != 0 && g.node(e.from()).type == "student";
        })
        // to compute penalty
        if(adjlist.length > 0) {
            var from = g.node(adjlist[0].from()); //the student that is assigned
            for(let j = 0; j<adjlist.length; j++) {
                var fromLabel = from.label + " (Student #" + from.student_no + ")" ;
                let toLabel = g.node(adjlist[j].to()).label;
                if(!solution[fromLabel]) {
                    solution[fromLabel] = [toLabel]
                } else {
                    solution[fromLabel].push(toLabel);
                }
            }
        }
    }
    console.table(solution);
};

export default construct_graph