import dotenv from "dotenv"
dotenv.config()

import {default as PrizesService} from "../services/prizes.services.js"
import {default as LaureatesService} from "../services/laureates.services.js"

export const getAllLaureates = (req,res)=>{
    let laureateAttributes = req.params.laureateAttributes;
    laureateAttributes = typeof laureateAttributes === 'undefined' || laureateAttributes === '{laureateAttributes}' ? "" : laureateAttributes;

    let service = new PrizesService();
    service.getAllLaureates(laureateAttributes,(error,results)=>{
        if(error){return res.status(400).send({success:0,data:error});}
        return res.status(200).render("laureate/laureates.handlebars",results)
    });
}

export const getAllYearsLaureates = (req,res)=>{
    let sort = req.query.sort
    let service = new LaureatesService();
    service.getAllYearsLaureates(sort,(error,results)=>{
        if(error){return res.status(400).send({success:0,data:error});}
        return res.status(200).render("laureate/years.handlebars",results)
    })
}

export const addLaureate = (req,res)=>{
    let service = new PrizesService();
    service.getAllPrizes("",(error,results)=>{
        if(error){return res.status(400).send({success:0,data:error});}
        return res.status(200).render("laureate/add.handlebars",results)
    });
}
export const addLaureatePOST = (req,res,next)=>{
    let year = req.body.year
    let category = req.body.category
    let firstname = req.body.firstname
    let surname = req.body.surname
    let motivation = req.body.motivation
    let service = new LaureatesService();
    service.addLaureate(year,category,firstname,surname,motivation,(error,results)=>{
        if(error){return res.status(400).send({success:0,data:error});}
        console.log(results)
    })
    next();
}

export const updateLaureate = (req,res)=>{
    let service = new PrizesService();
    service.getAllPrizes("",(error,results)=>{
        if(error){return res.status(400).send({success:0,data:error});}
        return res.status(200).render("laureate/update.handlebars",results)
    });
}
export const updateLaureatePOST = (req,res,next)=>{
    let id=req.body.id
    let year=req.body.year
    let category=req.body.category
    let motivation=req.body.motivation

    let service = new LaureatesService();
    service.updateLaureate(id,year,category,motivation,(error,results)=>{
        if(error){return res.status(400).send({success:0,data:error});}
        console.log(results.message)
    })
    next();
}

export const deleteLaureate = (req,res)=>{
    let service = new PrizesService();
    service.getAllPrizes("",(error,results)=>{
        if(error){return res.status(400).send({success:0,data:error});}
        return res.status(200).render("laureate/delete.handlebars",results)
    });
}
export const deleteLaureatePOST = (req,res,next)=>{
    let id=req.body.id
    let year=req.body.year
    let category=req.body.category

    let service = new LaureatesService();
    service.deleteLaureate(id,year,category,(error,results)=>{
        if(error){return res.status(400).send({success:0,data:error});}
        console.log(results.message)
    })
    next();
}