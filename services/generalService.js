const Offer = require('../models/offer.model');
const inf = require('./infojobsService');

const dbfeed = async () =>  {
    try {
        const ofertas = await inf.getITOffers();
        await Offer.upsert(ofertas);
          
    } catch (error) {
        console.log({error: "Not able to feed database"});
    }
}

module.exports.databasefeed = dbfeed;