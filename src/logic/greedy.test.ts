import { Timeslot } from "../models/Timeslot/Timeslot"
import { Student } from "../models/Student/Student"
import { assign_students, swap_students, find_swap, assign_student_timeslot } from "./greedy";

// test("Assign students", () => {
//     let ts1 = new Timeslot(0,0,1,[]);
//     let ts2 = new Timeslot(0,1,2,[]);
//     let ts3 = new Timeslot(0,2,1,[]);
//     let ts4 = new Timeslot(0,3,1,[]);

//     let s1 = new Student("student1", [ts1, ts2, ts3], []);
//     let s2 = new Student("student2", [ts2,ts3,ts4], []);

//     let schedule = [[ts1, ts2, ts3, ts4]];
//     let new_schedule = assign_students([s1, s2], schedule);
//     console.log("new_schedule:");
//     console.log(new_schedule);



//     expect(1).toBe(0);
// })

test("find penalty edges", () => {
    let ts1 = new Timeslot(0,0,1,[]);
    let ts2 = new Timeslot(0,1,2,[]);
    let ts3 = new Timeslot(0,2,1,[]);
    let ts4 = new Timeslot(0,4,1,[]);
    let ts5 = new Timeslot(1,1,1,[]);
    let ts6 = new Timeslot(1,3,1,[]);


    let s1 = new Student("demo", [ts1, ts2, ts3], [ts1, ts3])
    expect(s1.find_penalty_timeslots()).toEqual([ts2]);

    let s2 = new Student("demo", [ts1, ts2, ts3, ts4], [ts1, ts4])
    expect(s2.find_penalty_timeslots()).toEqual([ts2,ts3]);

    let s3 = new Student("demo", [ts2, ts4, ts5, ts6], [ts2, ts4, ts6]);
    expect(s3.find_penalty_timeslots()).toEqual([]);
})

test("swap students", () => {
    let ts1 = new Timeslot(0,0,1,[]);
    let ts2= new Timeslot(0,1,1,[]);

    let s1 = new Student("1",[], []);
    let s2 = new Student("2",[],[]);

    ts1.assign_student(s1);
    ts2.assign_student(s2);
    s1.assign_timeslot(ts1);
    s2.assign_timeslot(ts2);

    swap_students(ts1, s1, s2);
    expect(ts1.assigned).toEqual([s2]);
    expect(s2.assigned).toEqual([ts2, ts1]);
})

test("find swap", () => {
    let ts1 = new Timeslot(0,0,1,[]);
    let ts2 = new Timeslot(0,1,2,[]);
    let ts3 = new Timeslot(0,2,1,[]);
    let ts4 = new Timeslot(0,4,1,[]);

    let s1 = new Student("1", [ts1, ts2, ts3], []);
    let s2 = new Student("2", [ts2, ts3, ts4], []);

    assign_student_timeslot(s1, ts1);
    assign_student_timeslot(s1, ts2);
    assign_student_timeslot(s1, ts3);
    
    assign_student_timeslot(s2, ts2);
    assign_student_timeslot(s2, ts4);

    expect(s2.find_penalty_timeslots()).toEqual([ts3]);

    find_swap(ts3, s2);

    expect(s2.find_penalty_timeslots()).toEqual([]);
    expect(s1.assigned).toEqual([ts1, ts2]);
    expect(s2.assigned).toEqual([ts2, ts4, ts3])

})