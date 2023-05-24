


const generateStack = async (offer) => {
     
    try {
        const { Configuration, OpenAIApi } = require("openai");
        const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }) ); 
        const completion = await openai.createChatCompletion({
            model:"gpt-3.5-turbo",
            messages: [
                {role:'user', content: `
                Clasifica la siguiente oferta de trabajo en una categoría numérica donde '1' corresponde a 'frontend', '2' a 'backend', '3' a 'fullstack', '4' a 'data', '5' a 'devops', '6' a 'mobile', y '7' a 'otro'. La respuesta debe ser solo el número correspondiente a la categoría, sin ninguna otra información. Aquí está la oferta de trabajo: ${JSON.stringify(offer.title)}`},
            ]
        });  


        console.log('PREGUNTA:', JSON.stringify(offer.title));
        console.log('RESPUESTA:', completion.data.choices[0].message);
        
        return parseInt(completion.data.choices[0].message.content);
          
    } catch(error) {
        console.log("Error from Completion (normally just limit use): " + error);
    }

}

module.exports.generateStack = generateStack;