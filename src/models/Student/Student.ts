import { Timeslot } from "../Timeslot/Timeslot";

export class Student {
    name: String
    preferences: Array<Timeslot>
    assigned: Array<Timeslot>
    
    constructor(name: String, preferences: Array<Timeslot>, assigned: Array<Timeslot>) {
        this.name = name;
        this.preferences = preferences;
        this.assigned = assigned;
        this.sort_preferences();
    }

    sort_preferences = () => {
        this.preferences.sort((a: Timeslot, b: Timeslot) => {
            if(a.day == b.day) {
                return a.timeslot - b.timeslot;
            } return a.day - b.day;
        });   
    }

    add_preference = (preference: Timeslot) => {
        let preferences = JSON.stringify(this.preferences);
        let preference_string = JSON.stringify(preference);
        if(preferences.indexOf(preference_string) == -1) {
            this.preferences.push(preference);
            this.sort_preferences();
        }
    }

    remove_preference = (preference: Timeslot) => {
        let preferences = JSON.stringify(this.preferences);
        let preference_string = JSON.stringify(preference);
        let index = preferences.indexOf(preference_string);
        console.log(preferences);
        console.log(preference_string);
        console.log(index);
        if(index > -1) {
            this.preferences.splice(index-1,1);
        }
    }

    //missing test
    count_diff_days_assigned = () => {
        return [...new Set(this.assigned.map((e) => e.day))].length;
    }
}