const addExtraProperties = async (offer) => {
    const skills = offer.skillsList.map(item => item.skill);
    
    try {
        const { Configuration, OpenAIApi } = require("openai");
        const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }) ); 
        const completion = await openai.createChatCompletion({
            model:"gpt-3.5-turbo",
            messages: [
                {role:'user', 
                content: `Clasifica la siguiente oferta de trabajo en una categoría numérica donde '1' corresponde a 'frontend', '2' a 'backend', '3' a 'fullstack', '4' a 'data', '5' a 'devops', '6' a 'mobile', y '7' a 'otro'. La respuesta debe ser solo el número correspondiente a la categoría, sin ninguna otra información. Aquí está la oferta de trabajo: ${offer.title}  `}
            ]
        });  


        console.log('PREGUNTA:', offer.title);
        console.log('RESPUESTA:', completion.data.choices[0].message);
        
        const generatedStack = parseInt(completion.data.choices[0].message.content);
        offer.stack = generatedStack;
        offer.skills = skills;
        return offer;
          
    } catch(error) {
        console.log("Error from completion (normally just a limit use, so it will be fixed automatically in next api call): " + error);
    }

}

module.exports.addExtraProperties = addExtraProperties;