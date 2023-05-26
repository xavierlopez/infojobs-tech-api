const Offer = require('../models/offer.model');
const inf = require('./infojobsService');

const databasefeed = async () =>  {
    let result;
    try {
        const ofertas = await inf.getITOffers();
        result= await Offer.upsert(ofertas);
          
    } catch (error) {
        console.log({error: "Not able to feed database"});
    }
    return (result || null)
}


module.exports.databasefeed = databasefeed;
