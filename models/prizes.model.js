import {Laureate} from "./laureates.model.js";

const _prize_year = Symbol('year');
const _prize_category = Symbol('category');
const _prize_laureates = Symbol('laureates');
const _prize_overallMotivation = Symbol('overallMotivation');

export class Prize{
    constructor(year,category) {
        this[_prize_year] = year;
        this[_prize_category] = category;
        this[_prize_laureates] = [];
        this[_prize_overallMotivation] = "";
    }

    get year(){return this[_prize_year];}
    get category(){return this[_prize_category];}
    get laureates(){return this[_prize_laureates];}
    get overallMotivation(){return this[_prize_overallMotivation];}

    set year(newYear){this[_prize_year] = newYear;}
    set category(newCategory){this[_prize_category] = newCategory;}
    set overallMotivation(newOverallMotivation){this[_prize_overallMotivation] = newOverallMotivation;}

    addLaureate(laureate){
        let newLaureate = new Laureate(laureate.id, laureate.firstname, laureate.surname, laureate.motivation, laureate.share)
        this.laureates.push(newLaureate);
    }

    get JSON(){
        var laureates = []
        for (let i = 0; i < this.laureates.length; i++) {
            laureates.push({
                id: this.laureates[i].id,
                firstname: this.laureates[i].firstname,
                surname: this.laureates[i].surname,
                motivation: this.laureates[i].motivation,
                share: this.laureates[i].share
            })
        }
        return  JSON.stringify({
            year:this.year,
            category:this.category,
            overallMotivation:this.overallMotivation,
            laureates:laureates
        });
    }

    static fromJSON(json){
        const data = JSON.parse(JSON.stringify(json));
        if (typeof data !== 'object'
            || !data.hasOwnProperty("year")
            || (typeof data.year !== 'string' && typeof data.year !== 'number')
            || !data.hasOwnProperty("category")
            || typeof data.category !== 'string')
        {
            throw new Error(`Not a Prize: ${json}`);
        }
        const prize = new Prize(data.year,data.category);
        return prize;
    }
}