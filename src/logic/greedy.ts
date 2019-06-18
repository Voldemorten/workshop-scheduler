
//check if a solution is feasible ie all timeslots are filled
export function check_schedule(schedule) {
    let total_number_of_assigned = schedule.reduce((acc, arr) => {
        return acc + arr.reduce((ac, s) => {
            return ac+s.assigned.length;
        },0)
    },0)

    console.log("total number of assigned: ", total_number_of_assigned);
    
    let diff = 0;
    for(let i = 0; i < schedule.length; i++) {
        for(let j = 0; j<schedule[i].length; j++) {
            let timeslot = schedule[i][j];
            if(timeslot.capacity > timeslot.assigned.length) {
                diff += timeslot.capacity - timeslot.assigned.length; 
                console.log(`Timeslot [${i},${j}] with capacity ${timeslot.capacity} only has ${timeslot.assigned.length} students assigned`)
            }
        }
    }
    console.log("difference is ", diff);
    return diff == 0;
}

export function get_total_penalty(students) {
    return students.reduce((acc, s) => {
        return acc + find_penalty_edges(s).length;
    },0)
}


export function generate_random_data() {
    let out = {}
    let no_of_students = Math.floor(Math.random() * (20 - 10 + 1)) + 10; //between 50 and 100;
    let no_of_timeslots_per_day = Math.floor(Math.random() * (5 - 3 + 1)) + 3; //between 3 and 5;
    let no_of_days = Math.floor(Math.random() * (5 - 3 + 1)) + 3; //between 3 and 5;
    let timeslots_length = Math.floor(Math.random() * (3 - 1 + 1)) + 1; //between 1 and 3;
    let start_time = 8
    let max_preferences = Math.floor(Math.random() * (no_of_days*no_of_timeslots_per_day));
    let names = require('../data/names.json').names;

    console.log(`Random generated data... No of students: ${no_of_students}, No of days: ${no_of_days}, No of timeslots per day: ${no_of_timeslots_per_day}, length of timeslots: ${timeslots_length}`);
    let total_capacity = 0;
    //generate timeslots
    let timeslots = [];
    for(let day = 0; day<no_of_days; day++) {
        for(let timeslot = 0; timeslot<no_of_timeslots_per_day; timeslot++) {
            // max = no of students / no of timeslots
            let capacity = Math.floor(Math.random() * ((no_of_students*max_preferences/4)/(no_of_timeslots_per_day*no_of_days) - 1 + 1)) + 1;
            total_capacity += capacity;
            let new_timeslot = {"day": day, "timeslot": timeslot, "capacity": capacity, "time": start_time+(timeslot-1)*timeslots_length+":00-"+(start_time+timeslot*timeslots_length)+":00" };
            timeslots.push(new_timeslot);
        }
    }
    //generate students
    let students = [];
    let total_preferences = 0;
    for(let i = 0; i<no_of_students; i++) {
        let name = names[i];
        // let no_of_preferences = Math.floor(Math.random()* (max_preferences));
        let no_of_preferences = Math.ceil(total_capacity/no_of_students);
        total_preferences += no_of_preferences;
        var preferences = [];    
        for(let j = 0; j<no_of_preferences; j++) {
            do {
                let day = Math.floor(Math.random() * (no_of_days));
                let timeslot = Math.floor(Math.random()* (no_of_timeslots_per_day));
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

        let new_student = {"name": name, "preferences": preferences};
        students.push(new_student);
    }
    out["timeslots"] = timeslots;
    out["students"] = students;
    out["no_of_timeslots_per_day"] = no_of_timeslots_per_day;
    out["total_capacity"] = total_capacity;
    out["total_preferences"] = total_preferences;
    return out;
}

export function construct_schedule(students, timeslots) {
    //add an empty "assigned" array to all timeslots
    for(let i = 0; i<timeslots.length; i++) {
        timeslots[i]["assigned"] = [];
    }
    //and students and convert preferences to timeslots
    for(let i = 0; i<students.length; i++) {
        students[i]["assigned"] = [];
        students[i]["index"] = i;
    }

    //convert timeslots to 2d array based on day and timeslot
    let schedule = [];
    for(let i = 0; i<timeslots.length; i++) {
        //count days
        if(!schedule[timeslots[i].day]) {
            schedule[timeslots[i].day] = [];
        }
        schedule[timeslots[i].day][timeslots[i].timeslot] = timeslots[i];
    }
    return schedule;
}

export function assign_students(students, schedule) {
     //assign students greedily
     for(let i = 0; i < students.length; i++) {
        let student = students[i];
        for(let j = 0; j < student.preferences.length; j++) {
            let preference = student.preferences[j];
            let day = preference[0];
            let time = preference[1];
            let timeslot = schedule[day][time];
            //if still capacity add student - greedy)
            if(timeslot.capacity > timeslot.assigned.length) {

                // console.log(JSON.parse(JSON.stringify(timeslot)));
                // console.log(JSON.parse(JSON.stringify(student)));
                
                timeslot.assigned.push(student.index);
                student.assigned.push(timeslot);

                // console.log("added student!");
                // console.log(JSON.parse(JSON.stringify(timeslot)));
                // console.log(JSON.parse(JSON.stringify(student)));
                // console.log("");

                //compute penalty of adding student 
                let penalty_edges = find_penalty_edges(student);
                for(let k = 0; k < penalty_edges.length; k++) {
                    console.log("penalty edges found!");
                    console.log(JSON.parse(JSON.stringify(penalty_edges)));
                    let penalty_edge = penalty_edges[k];
                    let problematic_timeslot = schedule[penalty_edge[0]][penalty_edge[1]];
                    find_swap(problematic_timeslot, student, students);
                    console.table(JSON.parse(JSON.stringify(schedule))[0]);
                }
            }
        }
    }
}

export function print_schedule(schedule) {
    let formatted = [];
    for(let i = 0; i < schedule.length; i++) {
        formatted[i] = schedule[i].map((t) => {
            return [t.capacity, t.assigned]
        })

    }
    console.table(formatted);
}

export function print_students(students) {
    console.table(students);
}

function find_swap(timeslot, new_student, students) {
    for(let i = 0; i < timeslot.assigned.length; i++) {
        let old_student_index = timeslot.assigned[i];
        let old_student = students[old_student_index];
        //compute combined penalty
        let combined_penalty_before = find_penalty_edges(old_student).length + find_penalty_edges(new_student).length;
        //try a swap
        swap_students(timeslot, new_student, i, students);

        let combined_penalty_after = find_penalty_edges(old_student).length + find_penalty_edges(new_student).length;
        if(combined_penalty_after > combined_penalty_before) {
            //swap students back
            swap_students(timeslot, old_student, i, students);
        }
    }
}

function swap_students(timeslot, new_student, old_student_index, students) {
    //remove timeslot from old student
    let old_student = timeslot.assigned[old_student_index];
    let index_of_timeslot = students[old_student].assigned.findIndex((e) => e == timeslot)
    students[old_student].assigned.splice(index_of_timeslot, 1);
    
    //add timeslot to new student
    new_student.assigned.push(timeslot);

    //swap students in timeslot
    timeslot.assigned[old_student_index] = new_student.index;
    return old_student;
}

function find_penalty_edges(student) {  
    let penalty_edges = []  
    //do the same for different days
    let no_days = count_diff_days_assigned(student);
    for(let i = 0; i<no_days; i++) {
        //filter assigned and preferences and turn them to JSON
        let assigned = student.assigned.filter((a) => a.day == i)
        let preferences = student.preferences.filter((p) => p[0] == i)
        if(assigned.length > 1 && preferences.length > 1) {

            let assigned_string = assigned.map((a) => JSON.stringify([a.day, a.timeslot]));
            let preferences_string = preferences.map(JSON.stringify);
            
            for(let i = 0; i<preferences.length; i++) {
                let preference = preferences[i];
                let preference_string = JSON.stringify(preference);
                
                // check if preference is in assigned
                if(assigned_string.indexOf(preference_string) < 0 ) {                    
                    //this means there might be a penalty
                    let index = preferences_string.indexOf(preference_string);
                    // console.log("student no ", student.index,  " is not assigned to preference: ", preference);
                    // console.log(`The preference is located at ${index}`);
                    
                    let down_index = closest_assigned_pref_down(index, assigned_string, preferences);
                    //only if there is a match on both up and down we incur a penalty
                    if(down_index != undefined) {                        
                        let up_index = closest_assigned_pref_up(index, assigned_string, preferences)
                        if(up_index != undefined) {
                            penalty_edges.push(preference);
                        }
                    }   
                }
            }
        }
    };        
    return penalty_edges;
}



function count_diff_days_assigned(student) {
    return [...new Set(student.assigned.map((e) => e.day))].length;
}

//find closest assigned preference in both directions
function closest_assigned_pref_down(index, assigned_string, preferences) {
    for(let i = index-1; i>=0; i--) {
        if(assigned_string.indexOf(JSON.stringify(preferences[i])) >= 0) {
            return i; 
        }
    }
}

function closest_assigned_pref_up(index, assigned_string, preferences) {
    for( let i = index+1; i<preferences.length; i++) {
        if(assigned_string.indexOf(JSON.stringify(preferences[i])) >= 0) {
            return i;
        }
    }
}

export default construct_schedule