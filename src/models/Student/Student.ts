export class Student {
    name: String
    preferences: Array<Array<Number>>
    
    constructor(name: String, preferences: Array<Array<Number>>) {
        this.name = name;
        this.preferences = preferences;
        this.sort_preferences();
    }

    sort_preferences = () => {
        this.preferences.sort((a: any, b: any) => {
            if(a[0] == b[0]) {
                return a[1] - b[1];
            } return a[0] - b[0];
        });   
    }

    add_preference = (preference: Array<Number>) => {
        let preferences = JSON.stringify(this.preferences);
        let preference_string = JSON.stringify(preference);
        if(preferences.indexOf(preference_string) == -1) {
            this.preferences.push(preference);
            this.sort_preferences();
        }
    }

    remove_preference = (preference: Array<Number>) => {
        let preferences = JSON.stringify(this.preferences);
        let preference_string = JSON.stringify(preference);
        let index = preferences.indexOf(preference_string);
        if(index > -1) {
            this.preferences.splice(index-1,1);
        }
    }
}