import Student from "components/Student";

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
}