const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express()
require("dotenv").config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
  res.send('Change coffee supplier server!')
})



const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASS}@cluster0.qhtx1li.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

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
    const coffeeCollection = client.db("changeProDB").collection("products");
    const userCollection = client.db("changeProDB").collection("users");
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    app.get("/products", async (req, res) => {
      const cursor = coffeeCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollection.findOne(query)
      res.send(result)
    })
    app.post("/products", async (req, res) => {
      const newItems = req.body;
      const result = await coffeeCollection.insertOne(newItems)
      res.send(result)
    })
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const coffee = req.body;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: coffee.name,
          price: coffee.price,
          foods: coffee.foods,
          quntity: coffee.quntity,
          receip: coffee.receip,
          brand: coffee.brand,
          profile: coffee.profile
        },
      };
      const result = await coffeeCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    })
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollection.deleteOne(query)
      res.send(result)
    })

    // firebase user email
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await userCollection.findOne(query)
      res.send(result)
    })
    app.post("/users", async (req, res) => {
      const newUsers = req.body
      const result = await userCollection.insertOne(newUsers)
      res.send(result)
    })
    app.patch("/users", async (req, res) => {
      const user = req.body
      const email = req.body.email
      const filter = { email}
      const updateDoc = {
        $set: {
          lastSignInTime: user.lastSignInTime
        }
      }
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result)
    })
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await userCollection.deleteOne(query)
      res.send(result)
    })
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



// https://i.ibb.co.com/wzr7Gz8/1.png
// https://i.ibb.co.com/mB2B4mG/2.png
// https://i.ibb.co.com/pvrBj9w/3.png
// https://i.ibb.co.com/gZDH9jP/4.png
// https://i.ibb.co.com/yYLvPrF/5.png
// https://i.ibb.co.com/FgqBZfY/6.png