const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Configuration, OpenAIApi } = require("openai");
        


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




offerSchema.statics.getStackFromAI = async (offer) => {
    try {
        const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }) );  
        const completion = await openai.createChatCompletion({
            model:"gpt-3.5-turbo",
            messages: [
                {role:'user', content: `
                Clasifica la siguiente oferta de trabajo en una categoría numérica donde '1' corresponde a 'frontend', '2' a 'backend', '3' a 'fullstack', '4' a 'data', '5' a 'devops', '6' a 'mobile', y '7' a 'otro'. La respuesta debe ser solo el número correspondiente a la categoría, sin ninguna otra información. Aquí está la oferta de trabajo: ${JSON.stringify(offer.title)}`},
            ]
        });

        if (!completion.data.choices || !completion.data.choices[0]) {
            throw new Error("Respuesta inesperada de la API de OpenAI");
        }

        console.log('PREGUNTA:', JSON.stringify(offer.title));
        console.log('RESPUESTA:', completion.data.choices[0].message);
        
        const generatedStack = parseInt(completion.data.choices[0].message.content);

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



offerSchema.statics.upsert = async (offers) => {
    
    for (const offer of offers) {
        
        const existingOffer = await Offer.findOne({ id: offer.id });

        if (!existingOffer) {   
            const AIGeneratedStack =  await Offer.getStackFromAI(offer);
            offer.stack = AIGeneratedStack;
            
            
            try {
                const newOffer = new Offer(offer);
                 await newOffer.save();                        
            } catch(error) {
                console.log(error);
            }
       }
    }

    return new Promise((resolve, reject) => {
        resolve(offers);
    });
}




/**
 * This method returns a stack type string based on a numerical input.
 *
 * @param {number} number - A number between 1 and 7 representing a type of software stack.
 * @returns {string} - Returns a string that represents the type of software stack.
 */
offerSchema.statics.getStringfromStackId=  (number) => {
    let classificationObj = {
        "1": "frontend",
        "2": "backend",
        "3": "fullstack",
        "4": "data",
        "5": "devops",
        "6": "mobile",
        "7": "otro"
    };
    return classificationObj[number] || 'Invalid';
}




const Offer = mongoose.model('offer', offerSchema);


module.exports = Offer;