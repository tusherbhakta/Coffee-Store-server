const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.fjjkq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db("coffeeDB").collection("coffee");
    const userCollection = client.db("coffeeDB").collection("users");


    app.get('/newcoffee', async(req, res)=>{
        const cursor = coffeeCollection.find({});
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/newcoffee/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await coffeeCollection.findOne(query);
        res.send(result);
    })



    app.post('/newcoffee', async(req, res)=>{
        const newCoffee = req.body;
        console.log(newCoffee);
        const result = await coffeeCollection.insertOne(newCoffee);
        res.send(result);
    })

    app.put('/newcoffee/:id', async(req, res)=>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const options = {upsert: true};

        const updatedCoffee = req.body;
        const coffee = {
            $set: {
                name: updatedCoffee.name,
                quantity: updatedCoffee.quantity,
                supplier: updatedCoffee.supplier,
                taste: updatedCoffee.taste,
                category: updatedCoffee.category,
                details: updatedCoffee.details,
                photo: updatedCoffee.photo
            },
        };
        const result = await coffeeCollection.updateOne(filter, coffee, options);
        res.send(result);
    })

    app.delete('/newcoffee/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await coffeeCollection.deleteOne(query);
        res.send(result);
    })




    // user related api 
    app.post('newuser', async(req, res) => {
        const newUser = req.body;
        console.log(newUser);
        const result = await userCollection.insertOne(newUser);
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('coffee shop server is working');
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});