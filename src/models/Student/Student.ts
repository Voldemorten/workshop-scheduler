import { Timeslot } from "../Timeslot/Timeslot";

export class Student {
    name: String
    preferences: Array<Timeslot>
    assigned: Array<Timeslot>
    index: number = 0
    
    constructor(name: String, preferences: Array<Timeslot>, assigned: Array<Timeslot>) {
        this.name = name;
        this.preferences = preferences;
        this.assigned = assigned;
        this.sort_preferences();
    }

    set_index(index:number) {
        this.index = index;
    }

    sort_preferences = () => {
        this.preferences.sort((a: Timeslot, b: Timeslot) => {
            if(a.day == b.day) {
                return a.timeslot - b.timeslot;
            } return a.day - b.day;
        });   
    }

    // sort_assigned = () => {
    //     this.assigned.sort((a: Timeslot, b: Timeslot) => {
    //         if(a.day == b.day) {
    //             return a.timeslot - b.timeslot;
    //         } return a.day - b.day;
    //     });   
    // }

    add_preference = (timeslot: Timeslot) => {
        let index = this.search_assigned_or_preferences(this.preferences, timeslot);
        if(index == -1) {
            this.preferences.push(timeslot);
            this.sort_preferences();
        }
    }

    remove_preference = (timeslot: Timeslot) => {
        let index = this.search_assigned_or_preferences(this.preferences, timeslot);
        if(index >= 0) this.preferences.splice(index,1);
    }

    assign_timeslot = (timeslot: Timeslot) => {
        if(this.search_assigned_or_preferences(this.assigned, timeslot) == -1) {
            this.assigned.push(timeslot);
        }
    }

    remove_assigned = (timeslot: Timeslot) => {
        let index = this.search_assigned_or_preferences(this.assigned, timeslot);
        if(index>=0) this.assigned.splice(index,1);
    }

    count_diff_days_assigned = () => {
        return [...new Set(this.assigned.map((e) => e.day))].length;
    }

    find_penalty_timeslots() {  
        let penalty_timeslots = []  
        //do the same for different days
        let no_days = this.count_diff_days_assigned();
        for(let i = 0; i<no_days; i++) {
            //filter assigned and preferences and turn them to JSON
            let assigned = this.assigned.filter((a) => a.day == i)
            let preferences = this.preferences.filter((p) => p.day == i)
            if(assigned.length > 1 && preferences.length > 1) {
                //check if preference is in assigned
                for(let j = 0; j<preferences.length; j++) {
                    let preference = preferences[j]
                    let found = this.search_assigned_or_preferences(this.assigned, preference);
                    if(found == -1) {
                        //not found. There might be a penalty. Find the position of the preference
                        let index = this.search_assigned_or_preferences(this.preferences, preference);
                        let found_down = this.closest_assigned_pref_down(index);
                        if(found_down != -1) {
                            let found_up = this.closest_assigned_pref_up(index);
                            if(found_up != -1) {
                                penalty_timeslots.push(preference);
                            }
                        }
                    }
                }
            }
        };        
        return penalty_timeslots;
    }

    search_assigned_or_preferences = (arr: Array<Timeslot>, timeslot: Timeslot) => {
        for(let i = 0; i < arr.length; i++) {
            if(arr[i].day == timeslot.day && arr[i].timeslot == timeslot.timeslot) {
                return i;
            }
        }
        return -1
    }

    //find closest assigned preference in both directions
    closest_assigned_pref_down = (index: number) => {
        for(let i = index-1; i>=0; i--) {
            let found = this.search_assigned_or_preferences(this.assigned, this.preferences[i])
            if(found >= 0) return found;
        }
        return -1;
    }

    closest_assigned_pref_up = (index: number) => {
        for(let i = index+1; i<this.preferences.length; i++) {
            let found = this.search_assigned_or_preferences(this.assigned, this.preferences[i])
            if(found >= 0) {
                return i;
            }
        }
        return -1;
    }
}