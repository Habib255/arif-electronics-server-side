const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

//middlewar
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.SERVER_PASS}@cluster0.r9sfv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log('db connected')
async function run() {
    try {
        await client.connect()
        const productionCollection = client.db('productStock').collection('product')
        app.get('/product', async (req, res) => {
            const query = {}
            const cursor = productionCollection.find(query)
            const products = await cursor.toArray()
            res.send(products)
        })
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productionCollection.findOne(query);
            res.send(product);
        });
        app.post('/product', async (req, res) => {
            const addProduct = req.body;
            console.log('add a new product', addProduct)
            const result = await productionCollection.insertOne(addProduct)
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('running server')
})

app.listen(port, () => {
    console.log('listening port', port)
})





