import { Student } from "./Student";

test("Test sorting_preferences of student", () => {
    let student1 = new Student("test student", [[1,0],[0,1]]);
    expect(student1.preferences).toEqual([[0,1],[1,0]]);
})

test("Test adding prefence", () => {
    let student = new Student("test student",[]);
    expect(student.preferences).toEqual([]);
    student.add_preference([1,0]);
    expect(student.preferences).toEqual([[1,0]])
    student.add_preference([1,1]);
    expect(student.preferences).toEqual([[1,0],[1,1]])
    student.add_preference([1,1]);
    expect(student.preferences).toEqual([[1,0],[1,1]])
})

test("Test removing preference", () => {
    let student = new Student("test student",[[0,1],[0,2],[0,3]]);
    expect(student.preferences).toEqual([[0,1],[0,2],[0,3]]);
    student.remove_preference([0,1]);
    expect(student.preferences).toEqual([[0,2],[0,3]]);
})