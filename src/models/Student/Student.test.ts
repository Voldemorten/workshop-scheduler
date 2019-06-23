import { Student } from "./Student";
import { Timeslot } from "../Timeslot/Timeslot";

test("Test sorting_preferences of student", () => {
    let timeslot1 = new Timeslot(1,0,1,[]);
    let timeslot2 = new Timeslot(0,1,1,[]);
    let student1 = new Student("test student", [timeslot1, timeslot2], []);
    expect(student1.preferences).toEqual([timeslot2,timeslot1]);
    
})

test("Test adding prefence", () => {
    let student = new Student("test student",[], []);
    let timeslot1 = new Timeslot(1,0,1,[])
    let timeslot2 = new Timeslot(1,1,1,[])
    let timeslot3 = new Timeslot(1,1,1,[])
    expect(student.preferences).toEqual([]);
    student.add_preference(timeslot1);
    expect(student.preferences).toEqual([timeslot1])
    student.add_preference(timeslot2);
    expect(student.preferences).toEqual([timeslot1, timeslot2])
    student.add_preference(timeslot3);
    expect(student.preferences).toEqual([timeslot1, timeslot2])
})

test("Test removing preference", () => {
    let timeslot1 = new Timeslot(0,1,1,[])
    let timeslot2 = new Timeslot(0,2,1,[])
    let timeslot3 = new Timeslot(0,3,1,[])

    let student = new Student("test student", [timeslot1, timeslot2, timeslot3], []);
    expect(student.preferences).toEqual([timeslot1, timeslot2, timeslot3]);
    student.remove_preference(new Timeslot(0,1,1,[]));
    expect(student.preferences).toEqual([timeslot2, timeslot3]);
})
