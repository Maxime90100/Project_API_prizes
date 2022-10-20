import {default as LaureatesService} from "../services/laureates.services.js"

export const validateLaureateAttribute = async (req,res,next)=>{
    let laureateAttribut = req.params.laureateAttributes;
    laureateAttribut = typeof laureateAttribut === 'undefined' || laureateAttribut === '{laureateAttribut}' ? "none" : laureateAttribut;

    let service = new LaureatesService();
    let isValid = true;
    let error = {error:[{message: ""}]};

    if(laureateAttribut !== "none"){
        let attributs = []
        attributs = laureateAttribut.split('+')
        for (let attribut in attributs) {
            if(isNaN(attributs[attribut])){

                const firstname = await service.getAllFirstname()
                const surname = await service.getAllSurname()
                const category = await service.getAllCategories()

                isValid = firstname.includes(attributs[attribut].toLowerCase()) || surname.includes(attributs[attribut].toLowerCase()) || category.includes(attributs[attribut].toLowerCase())
                error.error.message = "Firstname or Surname of laureate holder doesn't exist! \nor\n No laureates exist in this category or category is not correct!"
            }else{
                const id = await service.getAllId()
                const year = await service.getAllYears()
                console.log(year)
                isValid = id.includes(attributs[attribut]) || year.includes(attributs[attribut])
                error.error.message = "Id of laureate doesn't exist! \nor\n No laureate exist this year or year is not correct!"
            }
        }
    }
    if(isValid){next();}
    else{res.status(400).render("error404.handlebars", error)}
}

export const validateSort = async (req,res,next)=>{
    let sort = req.query.sort
    sort = typeof sort === 'undefined' ? "none" : sort;
    let error = {error:[{message: "Sort must be asc(ascending) or desc(descending)"}]};

    let isValid = true;
    if(sort !== "none"){
        if(!(sort === 'asc' || sort === 'desc')){
            isValid = false
        }
    }

    if(isValid){next();}
    else{res.status(400).render("error404.handlebars", error)}
}