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
            detailed_offer = detailed_offer ? await Offer.processOfferWithAI(detailed_offer) : detailed_offer;


            //Third: we save offer to DB.
            if (detailed_offer && detailed_offer.stack) {
                const newOffer = new Offer(detailed_offer);
                try {
                    result = await newOffer.save();  
                } catch (e) {
                    console.log("Error saving new Offer:" +e);
                }
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





offerSchema.statics.getStringfromStackId =  (number) => {
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



offerSchema.statics.simplifyOffer = (offer) => {


    let simplified_offer = {
        _id: offer._id,
        id: offer.id,
        title: offer.title,
        company: offer.profile.name,
        city: offer.city,
        stack: offer.stack,
        skills: offer.skills,
        url: offer.link,
        createdAt: offer.createdAt,
        updatedAt: offer.updatedAt,
        modality: offer.teleworking.id
      };

      let minSalary = offer.minPay!= undefined ? offer.minPay.amount : 0;
      let maxSalary = offer.minPay!= undefined ? offer.maxPay.amount : 0;
      if (minSalary > 0 ) simplified_offer.min_salary = minSalary;
      if (maxSalary > 0 ) simplified_offer.max_salary = maxSalary;
    
      return simplified_offer;
}




const Offer = mongoose.model('offer', offerSchema);


module.exports = Offer;