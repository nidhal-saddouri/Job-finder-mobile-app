    const Job = require('../models/jobModel');
    
class APIfeature{
    limitXpage
    constructor(query,strQuery){
        this.query = query;
        this.strQuery = strQuery;
        
    }

    filtring(){
        const queryObj = {...this.strQuery}
        const ignored = ['sort','page','limit','fields']
        ignored.forEach(e=> delete queryObj[e]);
        let strQ = JSON.stringify(queryObj);

        strQ = strQ.replace(/\b(gt|lte|gte|lt)\b/g, match=> `$${match}`)

        this.query.find(JSON.parse(strQ))

        return this;
    }

    sorting(){
        if(this.strQuery.sort){
            const sorted = this.strQuery.sort.split(",").join(" ");
         this.query =  this.query.sort(sorted)
        }else{
            this.query =  this.query.sort("-salary")
        }
        return this
    }
limiting(){
    if(this.strQuery.fields){
        const limited = this.query.fields.split(",").join(" ");
       this.query = this.query.select(limited)
    }else{
        this.query =  this.query.select("-__v")
}
return this
}
 
pagination(){
    const page = this.strQuery.page * 1 || 1;
         const limit = this.strQuery.limit * 1 || 6;
         const skip = (page - 1) * limit;
         this.query = this.query.skip(skip).limit(limit)
         this.limitXpage = page * limit
         return this
}
}

module.exports = APIfeature