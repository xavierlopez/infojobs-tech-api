const router = require('express').Router();
const Offer = require('../../models/offer.model');



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



//FEEDING THE DATABASE
router.patch('/dbfeed', async (req, res) => {
    const url_ofertas = 'https://api.infojobs.net/api/9/offer?category=informatica-telecomunicaciones&maxResults=50';
    const headers = {
        'Authorization': `Basic ${process.env.API_KEY}`,
      };
    try {
        const response = await fetch(url_ofertas,{headers});
        const ofertas_raw = await response.json();
        const ofertas = ofertas_raw.items;

        
        const bulkOps = ofertas.map(oferta => ({
            updateOne: {
              filter: { id: oferta.id },
              update: { $setOnInsert: oferta },
              upsert: true
            }
          }))
        
        
        const result = await Offer.bulkWrite(bulkOps);
          
        res.json(result);


    } catch (error) {
        res.status(500).json({error: "Not able to feed (update) database"});
    }
    
});





module.exports = router;