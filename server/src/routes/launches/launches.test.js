const request = require('supertest')
const app = require('../../app')
const { mongoConnect, mongooseDisconnect } = require('../../services/mongo')


describe('LAUNCH API', ()=>{

    beforeAll(async()=>{
        await mongoConnect()
    })

    afterAll(async ()=>{
        await mongooseDisconnect()
    })



    describe('Test GET/LAUNCHES',  ()=>{
        test('the server must respond with 200 success', async ()=>{
            // this request() function takes in the app as an argument
            // BTS : it takes the app object that we pass in calls the listen functiion on it and then it can make request to the resulting server
    
            const response = await request(app)
                .get('/v1/launches')
                .expect(200)
            // this is assertion
            // expect(response.statusCode).toBe(200)
        })
    })
    
    describe('Test POST/LAUNCHES', ()=>{
    
        const launchData = {
            mission: 'argentina',
            rocket : 'messi',
            target : 'Kepler-62 f',
            launchDate: 'January 4, 2028'
        }
    
        const launchDataWithoutDate = {
            mission: 'argentina',
            rocket : 'messi',
            target : 'Kepler-62 f',
        }
    
        const launchDataWithInvalidDate = {
            mission: 'argentina',
            rocket : 'messi',
            target : 'Kepler-62 f',
            launchDate: 'hello'
        }
    
        test('the server must respond with 201 created',async()=>{
            const response = await request(app)
                .post('/v1/launches')
                .send(launchData)
                .expect('Content-Type', /json/)
                .expect(201)
    
            // we need to handle the date case separately
            const requestDate = new Date(launchData.launchDate).valueOf()
            const responseDate = new Date(response.body.launchDate).valueOf()
            expect(requestDate).toBe(responseDate)
            // when we want to check the body we donot use the supertest assetions instead we use the jest asssertions
            expect(response.body).toMatchObject(launchDataWithoutDate)
        })
    
        test("It should catch missing required properties", async()=>{
    
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400)
                
    
            expect(response.body).toStrictEqual({
                error: "Missing fields"
            })
        })
    
        test('It should also catch invalid dates', async()=>{
    
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400)
                
    
            expect(response.body).toStrictEqual({
                error:"Invalid Launch Date"
            })
        })
    } )



})


