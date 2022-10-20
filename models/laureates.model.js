const _laureate_id = Symbol('id');
const _laureate_firstname = Symbol('firstname');
const _laureate_surname = Symbol('surname');
const _laureate_motivation = Symbol('motivation');
const _laureate_share = Symbol('share');

export class Laureate{
    constructor(id,firstname,surname,motivation,share) {
        this[_laureate_id] = id;
        this[_laureate_firstname] = firstname;
        this[_laureate_surname] = surname;
        this[_laureate_motivation] = motivation;
        this[_laureate_share] = share;
    }

    get id(){return this[_laureate_id];}
    get firstname(){return this[_laureate_firstname];}
    get surname(){return this[_laureate_surname];}
    get motivation(){return this[_laureate_motivation];}
    get share(){return this[_laureate_share];}

    set firstname(newFirstname){this[_laureate_firstname] = newFirstname;}
    set surname(newSurname){this[_laureate_surname] = newSurname;}
    set motivation(newMotivation){this[_laureate_motivation] = newMotivation;}
    set share(newShare){this[_laureate_share] = newShare;}

    get JSON(){
        return JSON.stringify({
            id:this.id,firstname:this.firstname,surname:this.surname,motivation:this.motivation,share:this.share
        });
    }

    static fromJSON(json){
        const data = JSON.parse(JSON.stringify(json));
        if (typeof data !== 'object' || !data.hasOwnProperty("id") || (typeof data.id !== 'string' && typeof data.year !== 'number'))
            throw new Error(`Not a Laureate: ${json}`);

        if(!data.hasOwnProperty("firstname")){data.firstname="";}
        if(!data.hasOwnProperty("surname")){data.surname="";}
        if(!data.hasOwnProperty("motivation")){data.motivation="";}
        if(!data.hasOwnProperty("share")){data.share="";}

        const laureate = new Laureate(data.id,data.firstname,data.surname,data.motivation,data.share);
        return laureate;
    }
}