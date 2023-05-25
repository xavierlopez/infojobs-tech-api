const router = require('express').Router();
const Offer = require('../../models/offer.model');

//CRUD OPERATIONS
router.get('/', async (req, res) => {
    try {
        const offers = await Offer.find();
        simplified_offers = offers.map(offer => Offer.simplifyOffer(offer));
        res.json(simplified_offers);
    } catch (error) {
        res.status(500).json({error: "Ha ocurrido un error"});
    }    
});

router.get('/:offerId', async (req,res) => {
    try {
        const offers = await Offer.find({id:req.params.offerId});
        if (offers.length > 0) {
            res.json(offers[0]);
          } else {
            res.status(404).json({ error: "La oferta no fue encontrada" });
          }
    } catch (error) {
        res.status(500).json({error: "Ha ocurrido un error"});
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
});


router.get('/stack/:stack', async (req,res) => {
    try {
       res.json(await Offer.getStackStatistics(req.params.stack));
    } catch(e) {
        console.log("Error while get Stack Statistics");
    }
});


module.exports = router;