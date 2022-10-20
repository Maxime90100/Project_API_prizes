export default class AllService {
    includeObject(array, object){
        let occurrence = 0
        let objectEntries = Object.entries(object)
        array.forEach((element)=>{
            let elementEntries = Object.entries(element)
            if(JSON.stringify(elementEntries) === JSON.stringify(objectEntries))
                occurrence++
        });
        if(occurrence > 0)
            return true
        return false
    }
}