const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

//middlewar
app.use(cors())
app.use(express.json())

//set connection

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
        app.get('/user', async (req, res) => {
            const email = req.query.email;
            const query = { userEmail: email };
            const cursor = productionCollection.find(query);
            const userItems = await cursor.toArray()
            res.send(userItems);
        });

        //data insert in server

        app.post('/product', async (req, res) => {
            const addProduct = req.body;
            const result = await productionCollection.insertOne(addProduct)
            res.send(result)
        });

        //data delete from server and UI
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await productionCollection.deleteOne(query)
            res.send(result)
        });

        // data update from UI to server
        app.put('/updateProduct/:id', async (req, res) => {
            const id = req.params.id
            const product = req.body.newAmount
            console.log(product)
            const query = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updatedProduct = {
                $set: {
                    quantity: product
                }
            }
            const result = await productionCollection.updateOne(query, updatedProduct, options)

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





