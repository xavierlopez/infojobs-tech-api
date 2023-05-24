const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const openAIService = require('../services/openAIService');
const inf = require('../services/infojobsService');        


const offerSchema = new Schema({
    id: { type: String,required:true },
    title: { type: String, required: true },
    requirementMin:{ type: String},    
    description: { type:String},
    stack:{type:String},
    skills:{type: Array}

},{
    timestamps: true,
    strict: false 
});




offerSchema.statics.upsert = async (offers) => {
    let result;
    for (const offer of offers) {
        const existingOffer = await Offer.findOne({ id: offer.id });
        if (!existingOffer) {   
            
            //First: we get the detailed offer 
            let detailed_offer = await inf.getDetailedOfferById(offer);
            
            //Second: we process the offer with AI Service, where new properties are added
            detailed_offer =  await Offer.processOfferWithAI(detailed_offer);
            
            //Third: we save offer to DB.
            if (detailed_offer && detailed_offer.stack) {
                const newOffer = new Offer(detailed_offer);
                result = await newOffer.save();  
            }        
       }
    }

    return (result || null);
}




offerSchema.statics.processOfferWithAI = async (offer) => {
    try {

        offer =  await openAIService.addExtraProperties(offer);
        
        if (offer!=undefined && offer.stack!=undefined) {
            offer.stack = Offer.getStringfromStackId(offer.stack);
            return offer;
        } else {
            return 0;
        }
    
    } catch (error) {
        console.log('Error processing Offer with AI:' + error);
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
    return classificationObj[number] || null;
}




const Offer = mongoose.model('offer', offerSchema);


module.exports = Offer;