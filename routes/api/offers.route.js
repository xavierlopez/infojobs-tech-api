const router = require('express').Router();
const Offer = require('../../models/offer.model');
const infojobsService = require('../../services/infojobsService');


//CRUD OPERATIONS
router.get('/', async (req, res) => {
    try {
        const offers = await Offer.find();
        res.json(offers);
    } catch (error) {
        res.status(500).json({error: "Ha ocurrido un error"});
    }    
});

router.get('/:offerId', async (req,res) => {
    //redireccionamos lo que nos devuelve infojobs
    const url_oferta = `https://api.infojobs.net/api/7/offer/${req.params.offerId}`;
    const headers = {
        'Authorization': `Basic ${process.env.API_KEY}`,
      };
    try {
        const response = await fetch(url_oferta,{headers});
        const oferta_raw = await response.json();
        res.json(oferta_raw);
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ error: 'Error en el servidor' });
      }

});

router.post('/', async (req,res) => {
    try {
        const newOffer = await Offer.create(req.body);
        res.json(newOffer);
    } catch {
        res.status(500).json({error:'An error ocurred'});
    }
});

router.put('/:offerId', async (req,res) => {
    try {
        const offerEdit = await Offer.findByIdAndUpdate(
            req.params.offerId,
            req.body,
            {new:true}
        );
        res.json(offerEdit);
    } catch {
        res.status(500).json({error:'An error ocurred'});
    }
});

router.delete('/:offerId', async (req,res) => {
    try {
        const offer = await Offer.findByIdAndDelete(req.params.offerId);
        res.json(offer);
    } catch {
        res.status(500).json({error:'An error ocurred'});
    }
})


/*
//FEEDING THE DATABASE through the REST API. 
//It shouldn't be necessary as we have a cron job executing every minute.
router.patch('/dbfeed', async (req, res) => {
    try {
        const gs = require('./services/generalService');
        result= await gs.databasefeed();
        res.json(result);

    } catch (error) {
        res.status(500).json({error: "Not able to feed database"});
    } 
});
*/




module.exports = router;