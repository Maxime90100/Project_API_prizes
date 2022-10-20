import fs from "fs"
import {Prize} from "../models/prizes.model.js";
import {default as AllService} from "./all.services.js";

export default class PrizesService {
    async getAllPrizes(prizeAttribute, callback){
        const prizes = await this.readAllPrizes();
        if(prizes.length===0){
            return callback([]);
        }
        let results = [];
        let nbPrizesOffered = 0;
        let nbLaureates = 0;

        let severalPrizes = await this.getAllSeveralPrizes()
        let mostLaureateCategory = await this.getMostLaureatePrize()
        let yearsWithoutLaureate = await this.getAllYearWithoutLaureate()
        let categories = await this.getAllCategories()
        let years = await this.getAllYears()

        prizes.forEach((prize)=>{
            if(prizeAttribute !== ""){
                if(isNaN(prizeAttribute)){
                    if(prize.category.toLowerCase() === prizeAttribute.toLowerCase()){
                        results.push(JSON.parse(prize.JSON))
                        if(prize.laureates.length !== 0){
                            nbPrizesOffered++
                            nbLaureates+=prize.laureates.length
                        }
                    }
                }else{
                    if(prize.year === prizeAttribute){
                        results.push(JSON.parse(prize.JSON))
                        if(prize.laureates.length !== 0){
                            nbPrizesOffered++
                            nbLaureates+=prize.laureates.length
                        }
                    }
                }
            }
            else{
                results.push(JSON.parse(prize.JSON))
                if(prize.laureates.length !== 0){
                    nbPrizesOffered++
                    nbLaureates+=prize.laureates.length
                }
            }
        })
        return callback(null,
            {
                "nbPrizesOffered":nbPrizesOffered,
                "nbLaureates":nbLaureates,
                "severalPrizes":severalPrizes,
                "prizes":results,"categories":categories,
                "years":years, "mostLaureateCategory":mostLaureateCategory,
                "yearsWithoutLaureate":yearsWithoutLaureate
            });
    }
    async getAllLaureates(laureateAttribute, callback){
        let allService = new AllService();
        let attributes = []
        if(laureateAttribute !== "")
            attributes = laureateAttribute.split('+')

        const prizes = await this.readAllPrizes();
        if(prizes.length===0)
            return callback([]);

        let nbLaureate = 0
        let laureates = [];

        prizes.forEach((prize)=>{
            let category = prize.category

            prize.laureates.forEach((laureate)=>{
                if(laureateAttribute !== ""){
                    attributes.forEach((attribute)=> {
                        if (isNaN(attribute)) {
                            let firstname = laureate.firstname
                            let surname = laureate.surname
                            if (((firstname !== undefined && (firstname.toLowerCase() === attribute.toLowerCase()))
                                || (surname !== undefined && (surname.toLowerCase() === attribute.toLowerCase()))
                                || (category.toLowerCase() === attribute.toLowerCase()))
                                && (!allService.includeObject(laureates,JSON.parse(laureate.JSON)))) {
                                laureates.push(JSON.parse(laureate.JSON))
                                nbLaureate++
                            }
                        } else {
                            if ((laureate.id === attribute || prize.year === attribute)
                            && (!allService.includeObject(laureates,JSON.parse(laureate.JSON)))){
                                laureates.push(JSON.parse(laureate.JSON))
                                nbLaureate++
                            }
                        }
                    });
                }
                else{
                    laureates.push(JSON.parse(laureate.JSON))
                    nbLaureate++
                }
            })
        })
        return callback(null,{"laureates":laureates,"nbLaureate":nbLaureate,"attributes":attributes})
    }
    async readAllPrizes(){
        try{
            const dataBuffer = fs.readFileSync("prize.json");
            let data = JSON.parse(dataBuffer.toString());
            const prizes = []
            for(let i=0; i<data.prizes.length; i++) {
                let prize = Prize.fromJSON(data.prizes[i]);
                if("laureates" in data.prizes[i]){
                    let nbLaureate = data.prizes[i].laureates.length;
                    for(let j=0; j<nbLaureate; j++)
                        prize.addLaureate(data.prizes[i].laureates[j]);
                }
                if("overallMotivation" in data.prizes[i]){
                    prize.overallMotivation = data.prizes[i].overallMotivation
                }
                prizes.push(prize);
            }
            return prizes;
        }catch (e){console.log(e);return[];}
    }
    async getAllYears(){
        const prizes = await this.readAllPrizes();
        if(prizes.length===0){
            return [];
        }
        let year = []
        prizes.forEach((prize)=>{
            year.push(prize.year)
        })
        let distinctYear = []
        year.forEach((year)=>{
            if(!distinctYear.includes(year))
                distinctYear.push(year)
        })
        return distinctYear
    }
    async getAllCategories(){
        const prizes = await this.readAllPrizes();
        if(prizes.length===0){
            return [];
        }
        let category = []
        prizes.forEach((prize)=>{
            category.push(prize.category.toLowerCase())
        })
        let distinctCategory = []
        category.forEach((category)=>{
            if(!distinctCategory.includes(category))
                distinctCategory.push(category)
        })
        return distinctCategory
    }
    async getAllSeveralPrizes(){
        const prizes = await this.readAllPrizes();
        if(prizes.length===0){
            return [];
        }
        let data = []
        prizes.forEach((prize)=>{
            prize.laureates.forEach((laureate)=>{
                if(laureate.firstname !== undefined && laureate.surname !== undefined)
                    data.push([laureate.firstname,laureate.surname])
            });
        });
        let severalPrizes = []
        data.forEach((laureateHolder)=>{
            let nbLaureate = 0
            data.forEach((element)=>{
                if(JSON.stringify(laureateHolder) === JSON.stringify(element))
                    nbLaureate++
            });
            if(nbLaureate > 1){
                let isIn = false;
                severalPrizes.forEach((holder)=>{
                    if(JSON.stringify(holder) === JSON.stringify(laureateHolder))
                        isIn = true;
                });
                if(!isIn){
                    laureateHolder.push(nbLaureate.toString())
                    severalPrizes.push(laureateHolder)
                }
            }
        });
        let winSeveralPrizes = []
        severalPrizes.forEach((several)=>{
            winSeveralPrizes.push({firstname:several[0], surname:several[1], nbPrize:several[2]})
        })
        return winSeveralPrizes
    }
    async getMostLaureatePrize(){
        const prizes = await this.readAllPrizes();
        const categories = await this.getAllCategories();
        let mostNbLaureate = 0;
        let mostLaureateCategory;
        categories.forEach((category)=>{
            let nbLaureate = 0
            prizes.forEach((prize)=>{
                if(prize.category === category)
                    nbLaureate+=prize.laureates.length
            })
            if(nbLaureate > mostNbLaureate)
                mostLaureateCategory = category
        })
        return mostLaureateCategory
    }
    async getAllYearWithoutLaureate(){
        const prizes = await this.readAllPrizes();
        const allYears = await this.getAllYears();
        let yearsWithLaureate = []
        prizes.forEach((prize)=>{
            if(prize.laureates.length > 0)
                yearsWithLaureate.push(prize.year)
        })
        let noLaureateYear = []
        allYears.forEach((year)=>{
            if(!yearsWithLaureate.includes(year))
                noLaureateYear.push(year)
        })
        return noLaureateYear
    }
}