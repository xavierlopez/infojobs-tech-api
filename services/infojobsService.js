async function getITOffers()  {
    const url_ofertas = 'https://api.infojobs.net/api/9/offer?category=informatica-telecomunicaciones&maxResults=23';
    const headers = {
        'Authorization': `Basic ${process.env.API_KEY}`,
      };

    const response = await fetch(url_ofertas, {headers});
    const ofertas_raw = await response.json();
    
    return ofertas_raw.items;
}

async function getOffersById(id)  {
    const url_oferta = 'https://api.infojobs.net/api/9/offer/'+id;
    const headers = {
        'Authorization': `Basic ${process.env.API_KEY}`,
      };

    const response = await fetch(url_oferta, {headers});
    const oferta = await response.json();
    
    return oferta;
}


module.exports = {
    getITOffers,
    getOffersById
}