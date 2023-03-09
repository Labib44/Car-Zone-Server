const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r6wv8dh.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const productsCollection = client.db('car-zone').collection('products');
        const bookingsCollection = client.db('car-zone').collection('AddCart');
        const usersCollection = client.db('car-zone').collection('users');
        const wishlistCollection = client.db('car-zone').collection('wishlist');

        app.get('/products', async (req, res) => {
            const qeery = {};
            const limit = 3;
            const products = await productsCollection.find(qeery).limit(limit).toArray();
            res.send(products);
        })

        // Get the all products from Db
        app.get('/moreProducts', async (req, res) => {
            const qeery = {};
            const moreProducts = await productsCollection.find(qeery).toArray();
            res.send(moreProducts);
        })

        // Get the product from Db
        app.get('/moreProducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const mProducts = await productsCollection.findOne(query);
            res.send(mProducts);
        })

        // Save the Data to Db
        app.post('/AddCart', async (req, res) => {
            const booking = req.body;
            // console.log(booking);
            const result = await bookingsCollection.insertOne(booking);
            res.send(result);
        })

        app.get('/AddCart', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }

            }
            const result = await bookingsCollection.find(query).toArray();
            res.send(result);
        })

        app.delete('/AddCart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await bookingsCollection.deleteOne(query);
            res.send(result);
        })

        // Post Users
        app.post('/users', async (req, res) => {
            const user = req.body;
            // console.log(booking);
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        // get all user 
        app.get('/users', async (req, res) => {
            const qeery = {};
            const result = await usersCollection.find(qeery).toArray();
            res.send(result);
        })

        // Wish List 
        app.post('/wishlist', async (req, res) => {
            const wishlist = req.body;
            // console.log(booking);
            const result = await wishlistCollection.insertOne(wishlist);
            res.send(result);
        })


    }
    finally {

    }
}
run().catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send('Car-Zone server is running')
})

app.listen(port, () => {
    console.log(`Car Zone server running on ${port}`);
})