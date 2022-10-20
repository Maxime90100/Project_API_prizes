import {default as PrizesService} from "../services/prizes.services.js"
import fs from "fs";

export default class LaureatesService {
    async getAllId(){
        let service = new PrizesService();
        let id = []
        await service.getAllLaureates("",(error,results)=>{
            if(error){return res.status(400).send({success:0,data:error});}
            for(let laureate in results.laureates)
                id.push(results.laureates[laureate].id)
        });
        return id
    }
    async getAllFirstname(){
        let service = new PrizesService();
        let firstname = []
        await service.getAllLaureates("",(error,results)=>{
            if(error){return res.status(400).send({success:0,data:error});}
            for(let laureate in results.laureates){
                let data = results.laureates[laureate].firstname
                if(data !== undefined)
                    firstname.push(data.toLowerCase())
            }
        });
        return firstname
    }
    async getAllSurname(){
        let service = new PrizesService();
        let surname = []
        await service.getAllLaureates("",(error,results)=>{
            if(error){return res.status(400).send({success:0,data:error});}
            for(let laureate in results.laureates){
                let data = results.laureates[laureate].surname
                if(data !== undefined)
                    surname.push(data.toLowerCase())
            }
        });
        return surname
    }
    async getAllCategories(){
        let service = new PrizesService();
        let category = []
        await service.getAllPrizes("",(error,results)=>{
            if(error){return res.status(400).send({success:0,data:error});}
            for(let prize in results.prizes){
                if(results.prizes[prize].laureates !== undefined && results.prizes[prize].laureates.length !== 0)
                    category.push(results.prizes[prize].category.toLowerCase())
            }
        });
        return category
    }
    async getAllYears(){
        let service = new PrizesService();
        let year = []
        await service.getAllPrizes("",(error,results)=>{
            if(error){return res.status(400).send({success:0,data:error});}
            for(let prize in results.prizes){
                if(results.prizes[prize].laureates !== undefined && results.prizes[prize].laureates.length !== 0)
                    year.push(results.prizes[prize].year)
            }
        });
        const distinctYear = year.filter(function(ele , pos){
            return year.indexOf(ele) === pos;
        })
        return distinctYear
    }
    async getAllYearsLaureates(sort,callback){
        let service = new PrizesService();
        let tabYears = []
        await service.getAllPrizes("",(error,results)=>{
            if(error){return callback([]);}
            for(let prize in results.prizes){
                let year = results.prizes[prize].year
                let nbLaureate = results.prizes[prize].laureates.length
                tabYears.push([year,nbLaureate])
            }
        })
        let tabYear = await this.getAllYears();
        let years = []
        tabYear.forEach((year)=>{
            let nbLaureate = 0
            tabYears.forEach((element)=>{
                if(element[0] === year)
                    nbLaureate+=element[1]
            })
            years.push({year:year,nbLaureate:nbLaureate})
        })

        sort = typeof sort === 'undefined' ? "none" : sort;
        if(sort !== "none" && sort === 'asc')
            years.sort(function (a,b){return a.nbLaureate-b.nbLaureate;})
        if(sort !== "none" && sort === 'desc')
            years.sort(function (a,b){return b.nbLaureate-a.nbLaureate;})

        return callback(null,{years:years})
    }
    async getMaxId(){
        let service = new PrizesService();
        let maxId = 0
        await service.getAllLaureates("",(error,results)=>{
            if(error){return res.status(400).send({success:0,data:error});}
            for(let laureate in results.laureates){
                if(Number(results.laureates[laureate].id) > Number(maxId))
                    maxId = Number(results.laureates[laureate].id)
            }
        });
        return maxId
    }

    async addLaureate(year,category,firstname,surname,motivation,callback){
        let maxId = await this.getMaxId()
        let service = new PrizesService();

        await service.getAllPrizes("",(error,results)=>{
            if(error){return callback([])}

            let id = (maxId+1).toString()
            results.prizes.forEach((prize)=> {
                prize.laureates.forEach((laureate) => {
                    if (laureate.firstname.toLowerCase() === firstname.toLowerCase() && laureate.surname.toLowerCase() === surname.toLowerCase())
                    id = laureate.id
                });
            });

            results.prizes.forEach((prize)=>{
                if(prize.year === year && prize.category === category){
                    prize.laureates.push({
                        id: id,
                        firstname: firstname,
                        surname: surname,
                        motivation: motivation,
                        share: '0'
                    });
                }
            });
            try{
                const dataJSON = JSON.stringify({prizes:results.prizes})
                fs.writeFileSync('prize.json', dataJSON)
                return callback(null, "Added successfully")
            }catch(e){
                console.log(e);
                return callback("Add failed!")
            }
        });
    }

    async updateLaureate(id,year,category,motivation,callback){
        let service = new PrizesService();
        await service.getAllPrizes("",(error,results)=>{
            if(error){return callback([])}
            results.prizes.forEach((prize)=>{
                if(prize.year === year && prize.category === category){
                    prize.laureates.forEach((laureate)=>{
                        if(laureate.id === id)
                            laureate.motivation = motivation
                    });
                }
            });
            try{
                const dataJSON = JSON.stringify({prizes:results.prizes})
                fs.writeFileSync('prize.json', dataJSON)
                return callback(null, "Updated successfully")
            }catch(e){
                console.log(e);
                return callback("Update failed!")
            }
        });
        return callback(null,[])
    }

    async deleteLaureate(id,year,category,callback){
        let service = new PrizesService();
        await service.getAllPrizes("",(error,results)=>{
            if(error){return callback([])}
            results.prizes.forEach((prize)=>{
                if(prize.year === year && prize.category === category){
                    let index = 1
                    prize.laureates.forEach((laureate)=>{
                        if(laureate.id === id) {
                            prize.laureates.splice(index - 1, index)
                        }
                        index++
                    });
                }
            });
            try{
                const dataJSON = JSON.stringify({prizes:results.prizes})
                fs.writeFileSync('prize.json', dataJSON)
                return callback(null, "Deleted successfully")
            }catch(e){
                console.log(e);
                return callback("Delete failed!")
            }
        });
        return callback(null,[])
    }
}