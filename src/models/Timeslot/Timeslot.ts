import { Student } from "../Student/Student";

export class Timeslot {
    day: number
    timeslot: number
    capacity: number
    assigned: Array<Student>

    constructor(day: number, timeslot: number, capacity: number, assigned: Array<Student>) {
        this.day = day;
        this.timeslot = timeslot;
        this.capacity = capacity;
        this.assigned = assigned;
    }

    assign_student(student: Student) {
        if(this.search_assigned(student) == -1) {
            this.assigned.push(student);
        }
    }

    remove_student(student: Student) {
        let index = this.search_assigned(student);
        if(index >= 0) {
            this.assigned.splice(index,1);
        }
    }

    search_assigned(student: Student) {
        for(let i = 0; i < this.assigned.length; i++) {
            if(this.assigned[i].index == student.index) {
                return i;
            }
        }
        return -1;
    }
}