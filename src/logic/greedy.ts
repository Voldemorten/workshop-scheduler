import { Timeslot } from "../models/Timeslot/Timeslot";
import { Student } from "../models/Student/Student";
const names = require('../data/names.json').names


/**
 * SCHEDULE FUNCTIONS!
 */
export function assign_students(students: Array<Student>, schedule) {
    let out = {}
     //assign students greedily
     for(let i = 0; i < students.length; i++) {
        let student = students[i];
        student.set_index(i);
        for(let j = 0; j < student.preferences.length; j++) {
            let preference = student.preferences[j];
            let day = preference.day;
            let time = preference.timeslot;
            let timeslot = schedule[day][time];
            //if still capacity add student - greedy)
            if(timeslot.capacity > timeslot.assigned.length) {
                timeslot.assign_student(student);
                // student.assigned.push(timeslot);
                student.assign_timeslot(timeslot);

                //compute penalty of adding student 
                let penalty_timeslots = student.find_penalty_timeslots();
                for(let k = 0; k < penalty_timeslots.length; k++) {
                    console.log("penalty edges found: ", penalty_timeslots);
                    let penalty_timeslot = penalty_timeslots[k];
                    find_swap(penalty_timeslots[k], student);
                    console.table(JSON.parse(JSON.stringify(schedule))[0]);
                }
            }
        }
    }
    out["students"] = students;
    out["schedule"] = schedule;
    return out;
}

export function find_swap(timeslot:Timeslot, new_student:Student) {
    for(let i = 0; i < timeslot.assigned.length; i++) {
        let old_student = timeslot.assigned[i];
        //compute combined penalty
        let combined_penalty_before = old_student.find_penalty_timeslots().length + new_student.find_penalty_timeslots().length;
        //try a swap
        swap_students(timeslot, old_student, new_student);
        console.log("swapped ", old_student, " with ", new_student, " on ", timeslot);

        let combined_penalty_after = old_student.find_penalty_timeslots().length + new_student.find_penalty_timeslots().length;
        console.log("penalty before swap: ", combined_penalty_before, " penalty after swap: ", combined_penalty_after);
        if(combined_penalty_after > combined_penalty_before) {
            console.log("swapping back");
            //swap students back
            swap_students(timeslot, new_student, old_student);
        }
    }
}

export function swap_students(timeslot:Timeslot, old_student:Student, new_student:Student) {
    //remove timeslot from old_student
    old_student.remove_assigned(timeslot);
    //remove old_student from timeslot
    timeslot.remove_student(old_student);
    //add new student to timeslot
    timeslot.assign_student(new_student);
    //add timeslot to new student
    new_student.assign_timeslot(timeslot);
}

//check if a solution is feasible ie all timeslots are filled
export function check_schedule(schedule) {
    let total_number_of_assigned = schedule.reduce((acc, arr) => {
        return acc + arr.reduce((ac, s) => {
            return ac+parseInt(s.assigned.length);
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
    return diff;
}

export function clear_schedule(schedule:Array<Array<Timeslot>>) {
    for(let i = 0; i<schedule.length; i++) {
        for(let j = 0; j<schedule[i].length; j++) {
            schedule[i][j].assigned = [];
        }
    }
    return schedule;
}

/**
 * STUDENTS FUNCTIONS
 */
export function generate_students(timeslots: Array<Timeslot>, no_of_students: number) {
    let students = [];
    let no_of_preferences = Math.ceil(timeslots_get_total_capacity(timeslots)/no_of_students);
    for(let i = 0; i < no_of_students; i++) {
        let student = new Student(names[i],[],[]);
        for(let j = 0; j<no_of_preferences; j++) {
            let r = Math.floor(Math.random() * timeslots.length);
            let preference = timeslots[r];
            student.add_preference(preference);
        }
        students.push(student);
    }
    return students;
}

export function get_total_penalty(students) {
    return students.reduce((acc, s) => {
        return acc + s.find_penalty_timeslots().length;
    },0)
}

/**
 * TIMESLOTS FUNCTIONS
 */
export function generate_balanced_timeslots (no_of_days:number, no_of_timeslots_per_day:number, capacity:number) {
    let timeslots=[]
    for(let day = 0; day<no_of_days; day++) {
        for(let timeslot = 0; timeslot<no_of_timeslots_per_day; timeslot++) {
            // max = no of students / no of timeslots
            let new_timeslot = new Timeslot(day, timeslot, capacity, []);
            timeslots.push(new_timeslot);
        }
    }
    return timeslots;
}

export function search_timeslots(timeslots: Array<Timeslot>, day: number, timeslot: number) {
    for(let i = 0; i < timeslots.length; i++) {
        if(timeslots[i].day == day && timeslots[i].timeslot == timeslot) {
            return timeslots[i];
        }
    }
    return -1;
}

export function timeslots_get_total_capacity (timeslots: Array<Timeslot>) {
    return timeslots.reduce((acc, ts) => {
        return acc + ts.capacity;
    },0)
}

export function timeslots_get_number_of_days(timeslots: Array<Timeslot>) {
    return [...new Set(timeslots.map((e) => e.day))].length;
}

//assuming symmetric schedule
export function get_number_of_timeslots_per_day(timeslots: Array<Timeslot>) {
    return timeslots.filter(ts => ts.day == 0);
}

export function map_timeslots_to_schedule(timeslots: Array<Timeslot>) {
    //convert timeslots to 2d array based on day and timeslot
    let schedule = []
    for(let i = 0; i<timeslots.length; i++) {
        // timeslots[i]["assigned"] = [];
        //count days
        if(!schedule[timeslots[i].day]) {
            schedule[timeslots[i].day] = [];
        }
        schedule[timeslots[i].day][timeslots[i].timeslot] = timeslots[i];
    }
    return schedule;
}
/**
 * OTHER FUNCTIONS
 */
export function assign_student_timeslot(student: Student, timeslot: Timeslot) {
    student.assign_timeslot(timeslot);
    timeslot.assign_student(student);
}

/**
 * ---------------------
 * DEBUGGING
 * ---------------------
 */

//TODO: refactor this.
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

// export function demo() {
//     console.log("demo is run");
//     let students = require("../data/students.json").students6;
//     let timeslots = require("../data/timeslots.json").timeslots6
//     console.log(students);
//     console.log(timeslots);
//     let schedule = construct_schedule(timeslots);
//     let assigned_schedule = assign_students(students, schedule);
//     console.log(assigned_schedule);
//     console.log(students[0].find_penalty_timeslots());
//     console.log(get_total_penalty(students));
// }



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



export default generate_random_data