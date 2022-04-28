const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();

// MiddleWare
app.use(cors());
app.use(express());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ippp0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        // Connecting the client
        await client.connect();

        const productsCollection = client.db("emaJohn").collection("product");

        app.get('/products', async (req, res) => {
            console.log('query', req.query);
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = productsCollection.find(query);
            let products;
            if (page || size) {
                products = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                products = await cursor.toArray();
            }

            res.send(products);
        })

        app.get('/productCount', async (req, res) => {
            const count = await productsCollection.estimatedDocumentCount();

            res.send({ count });
        })

        // Use post to get products by id

        app.post('/productById', (req, res) => {
            const keys = req.body;
            console.log('this is req', req.body);

            res.send("this are products by keys");
        })
    }
    finally {

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("John is running")
});

app.listen(port, () => {
    console.log("Server running on port: ", port);
})
