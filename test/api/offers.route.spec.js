const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Offer = require('../../models/offer.model');

require('dotenv').config();

describe('Pruebas sobre la API de ofertas', () => {

    beforeAll( async () => {
        await mongoose.connect(process.env.DB_URL);
    });

    afterAll( async () => {
        await mongoose.disconnect();
    });


    describe('GET /api/offers', () => {
        
        let response;
        beforeEach( async () => {
            response = await request(app).get('/api/offers').send();
        });

        it('La ruta funciona', async () => {
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        });

        it('La petición nos devuelve un array de ofertas', async () =>{
            expect(response.body).toBeInstanceOf(Array);
        })


    });

    describe('POST /api/offers', () => {

        const newOffer = {title: 'Node guru and ninja', description: 'blabla',
                            category: 'full'};
        const wrongOffer = { name: 'Node guru and ninja'}; // 'name' does not exist


        afterAll( async () => {
            await Offer.deleteMany({title:'Node guru and ninja'});
        });


        it('La ruta funciona', async () => {
            const response = await request(app).post('/api/offers').send(newOffer);

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        });

        it('se inserta correctamente', async ()=>{
            const response = await request(app).post('/api/offers').send(newOffer);

            expect(response.body._id).toBeDefined(); 
            expect(response.body.name).toBe(newOffer.name);
        });

        it('Error en la inserción', async () => {
            const response = await request(app).post('/api/offers').send(wrongOffer);

            expect(response.status).toBe(500);
            expect(response.body.error).toBeDefined();
        });

    });

    describe('PUT /api/offers', () => {

        let offer;
        beforeEach(async () => {
            offer = await Offer.create({
                title:'oferta que luego se borra', description: 'blabla', category:'front'  })
        });

        afterEach(async() => {
            await Offer.findByIdAndDelete(offer._id);
        });

        it('La ruta funciona', async ()=> {
            const response = await request(app).put(`/api/offers/${offer._id}`).send({
                title: 'Oferta actualizada'
            });
         
            expect(response.status).toBe(200);
            expect(response.header['content-type']).toContain('json');
        });


        it('Se actualiza correctamente', async () => {
            const response = await request(app).put(`/api/offers/${offer._id}`).send({
                title: 'Oferta actualizada'
            });

            expect(response.body._id).toBeDefined();
            expect(response.body.title).toBe('Oferta actualizada');
        });

    });

    describe('DELETE /api/offers', () =>{

        let offer;
        let response;
        beforeEach( async () => {
            offer = await Offer.create({title:'oferta', description:'aaa', category:'full'});
            response = await request(app).delete(`/api/offers/${offer._id}`).send();
        });
        
        it('La ruta funciona', () => {
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        });

        it('Borra correctamente', async () => {
            expect(response.body._id).toBeDefined();

            const foundOffer = await Offer.findById(offer._id);
            expect(foundOffer).toBeNull();

        })

    });

});