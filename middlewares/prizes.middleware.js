import {default as PrizesService} from "../services/prizes.services.js"

export const validatePrizeAttribute = async (req,res,next)=>{
    let prizeAttribut = req.params.prizeAttributes;
    prizeAttribut = typeof prizeAttribut === 'undefined' || prizeAttribut === '{prizeAttribut}' ? "none" : prizeAttribut;

    let service = new PrizesService();
    let isValid = true;
    let error = {error:[{message: ""}]};

    if(prizeAttribut !== "none"){
        if(isNaN(prizeAttribut)){
            const category = await service.getAllCategories()
            isValid = category.includes(prizeAttribut.toLowerCase())
            error.error.message = "No prizes exist in this category or category is not correct!"
        }else{
            const year = await service.getAllYears()
            isValid = year.includes(prizeAttribut)
            error.error.message = "No prizes exist this year or year is not correct!"
        }
    }

    if(isValid){next();}
    else{res.status(400).render("error404.handlebars", error)}
}