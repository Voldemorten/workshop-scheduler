import { Student } from "./Student";
import { Timeslot } from "../Timeslot/Timeslot";

test("Test sorting_preferences of student", () => {
    let ts1 = new Timeslot(1,0,1,[]);
    let ts2 = new Timeslot(0,1,1,[]);
    let student1 = new Student("test student", [ts1, ts2], []);
    expect(student1.preferences).toEqual([ts2,ts1]);
    
})

test("Test adding prefence", () => {
    let student = new Student("test student",[], []);
    let ts1 = new Timeslot(1,0,1,[])
    let ts2 = new Timeslot(1,1,1,[])
    let ts3 = new Timeslot(1,1,1,[])
    expect(student.preferences).toEqual([]);
    student.add_preference(ts1);
    expect(student.preferences).toEqual([ts1])
    student.add_preference(ts2);
    expect(student.preferences).toEqual([ts1, ts2])
    student.add_preference(ts3);
    expect(student.preferences).toEqual([ts1, ts2])
})

test("Test removing preference", () => {
    let ts1 = new Timeslot(0,1,1,[])
    let ts2 = new Timeslot(0,2,1,[])
    let ts3 = new Timeslot(0,3,1,[])

    let student = new Student("test student", [ts1, ts2, ts3], []);
    expect(student.preferences).toEqual([ts1, ts2, ts3]);
    student.remove_preference(new Timeslot(0,1,1,[]));
    expect(student.preferences).toEqual([ts2, ts3]);
})

test("Test assigning timeslot", () => {
    let student = new Student("test student",[], []);
    let ts1 = new Timeslot(1,0,1,[])
    let ts2 = new Timeslot(1,1,1,[])
    let ts3 = new Timeslot(1,1,1,[])
    expect(student.assigned).toEqual([]);
    student.assign_timeslot(ts1);
    expect(student.assigned).toEqual([ts1])
    student.assign_timeslot(ts2);
    expect(student.assigned).toEqual([ts1, ts2])
    student.assign_timeslot(ts3);
    expect(student.assigned).toEqual([ts1, ts2])
})

test("Test removing assigned timeslot", () => {
    let ts1 = new Timeslot(0,1,1,[])
    let ts2 = new Timeslot(0,2,1,[])
    let ts3 = new Timeslot(0,3,1,[])

    let student = new Student("test student", [], [ts1, ts2, ts3]);
    expect(student.assigned).toEqual([ts1, ts2, ts3]);
    student.remove_assigned(new Timeslot(0,1,1,[]));
    expect(student.assigned).toEqual([ts2, ts3]);
})

test("count different days assigned", () => {
    let ts1 = new Timeslot(0,1,1,[])
    let ts2 = new Timeslot(1,2,1,[])
    let ts3 = new Timeslot(2,3,1,[])

    let student = new Student("test student", [], [ts1]);
    expect(student.count_diff_days_assigned()).toBe(1);
    student.assign_timeslot(ts2);
    expect(student.count_diff_days_assigned()).toBe(2);
    student.assign_timeslot(ts3);
    expect(student.count_diff_days_assigned()).toBe(3);
})

test("search arr for timeslot", () => {
    let ts1 = new Timeslot(0,1,1,[])
    let ts2 = new Timeslot(0,2,1,[])
    let ts3 = new Timeslot(0,3,1,[])
    let ts4 = new Timeslot(0,4,1,[])
    let ts5 = new Timeslot(0,5,1,[])

    let arr = [ts1, ts2, ts3, ts4, ts5];

    let s = new Student("",[],[]);
    
    expect(s.search_assigned_or_preferences(arr, ts1)).toBe(0);
    expect(s.search_assigned_or_preferences(arr, ts2)).toBe(1);
    expect(s.search_assigned_or_preferences(arr, ts3)).toBe(2);
    expect(s.search_assigned_or_preferences(arr, ts4)).toBe(3);
    expect(s.search_assigned_or_preferences(arr, ts5)).toBe(4);
}) 

test("closts assigned pref", () => {
    let ts1 = new Timeslot(0,1,1,[])
    let ts2 = new Timeslot(0,2,1,[])
    let ts3 = new Timeslot(0,3,1,[])
    let ts4 = new Timeslot(0,4,1,[])
    let ts5 = new Timeslot(0,5,1,[])

    let preferences = [ts1, ts2, ts3, ts4, ts5];
    let assigned = [ts1, ts3, ts5];

    let student = new Student("demo", preferences, assigned);
    let found = student.search_assigned_or_preferences(assigned, ts2);
    let index = student.search_assigned_or_preferences(preferences, ts3);

    expect(student.closest_assigned_pref_down(index)).toBe(0);
    expect(student.closest_assigned_pref_up(index)).toBe(4);

    let student2 = new Student("demo", preferences, [ts1, ts5]);
    expect(student2.closest_assigned_pref_down(4)).toBe(0);
    expect(student2.closest_assigned_pref_down(3)).toBe(0);
    expect(student2.closest_assigned_pref_down(2)).toBe(0);
    expect(student2.closest_assigned_pref_down(1)).toBe(0);    
    expect(student2.closest_assigned_pref_down(0)).toBe(-1);    
    
    expect(student2.closest_assigned_pref_up(4)).toBe(-1);
    expect(student2.closest_assigned_pref_up(3)).toBe(4);
    expect(student2.closest_assigned_pref_up(2)).toBe(4);
    expect(student2.closest_assigned_pref_up(1)).toBe(4);    
    expect(student2.closest_assigned_pref_up(0)).toBe(4);    

    
})

test("find penalty edges", () => {
    let ts1 = new Timeslot(0,1,1,[])
    let ts2 = new Timeslot(0,2,1,[])
    let ts3 = new Timeslot(0,3,1,[])
    let ts4 = new Timeslot(0,4,1,[])

    let student = new Student("demo", [ts1, ts2, ts3], [ts1, ts3]);

    // expect(student.find_penalty_timeslots()).toEqual([ts2]);

    let student2 = new Student("demo2", [ts1, ts2, ts3, ts4], [ts1, ts3]);
    expect(student2.find_penalty_timeslots()).toEqual([ts2]);
})


