import dotenv from "dotenv"
dotenv.config()

import {default as PrizesService} from "../services/prizes.services.js"

export const getAllPrizes = (req,res)=>{
    let prizeAttributes = req.params.prizeAttributes;
    prizeAttributes = typeof prizeAttributes === 'undefined' || prizeAttributes === '{prizeAttributes}' ? "" : prizeAttributes;

    let service = new PrizesService();
    service.getAllPrizes(prizeAttributes,(error,results)=>{
        if(error){return res.status(400).send({success:0,data:error});}
        return res.status(200).render("prize/prizes.handlebars",results)
    });
}