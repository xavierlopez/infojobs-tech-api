const mongoose = require('mongoose');
const openAIService = require('../services/openAIService');
const Schema = mongoose.Schema;

        


const offerSchema = new Schema({
    id: { type: String },
    title: { type: String, required: true },
    requirementMin:{ type: String},
    city: {},
        
    description: { type:String},
    stack:{type:String, enum: ['frontend', 'backend', 'fullstack', 'mobile', 'devops','data', 'otro']},

},{
    timestamps: true
});






offerSchema.statics.upsert = async (offers) => {
    
    for (const offer of offers) {
        
        const existingOffer = await Offer.findOne({ id: offer.id });

        if (!existingOffer) {   
            
            const aIGeneratedStack =  await Offer.getStackFromAI(offer);
            if (aIGeneratedStack) {
                offer.stack = aIGeneratedStack;
                const newOffer = new Offer(offer);
                await newOffer.save();  
            }        
       }
    }
    return new Promise((resolve, reject) => {
        resolve(offers);
    });
}




offerSchema.statics.getStackFromAI = async (offer) => {
    try {

        const generatedStack = await openAIService.generateStack(offer);
        const allowedStacks = [1, 2, 3, 4, 5, 6, 7];

        if (allowedStacks.includes(generatedStack)) {
            return Offer.getStringfromStackId(generatedStack);
        } else {
            return 0;
        }
    
    } catch (error) {
        console.log(error);
    }
}





offerSchema.statics.getStringfromStackId=  (number) => {
    let classificationObj = {
        1: "frontend",
        2: "backend",
        3: "fullstack",
        4: "data",
        5: "devops",
        6: "mobile",
        7: "otro"
    };


    return classificationObj[number] || 'Invalid';
}




const Offer = mongoose.model('offer', offerSchema);


module.exports = Offer;