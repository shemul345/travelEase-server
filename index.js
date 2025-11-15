const express = require('express')
const cors = require('cors');
require("dotenv").config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.svjtwrm.mongodb.net/?appName=Cluster0`;

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
    // await client.connect();

    const db = client.db('travelEase_db')
    const vehiclesCollection = db.collection('vehicles')
    const bookingsCollection = db.collection('bookings')

    // Get APIs
    app.get('/vehicles', async(req, res) => {
      const result = await vehiclesCollection.find().toArray();
      res.send(result)
    })

  app.get('/vehicles/:id', async (req, res) => {
        const {id} = req.params
        const objectId = new ObjectId(id)
        const result = await vehiclesCollection.findOne({_id: objectId})
           
        res.send({
            success: true,
            result
        })
    })

    app.get('/myVehicles', async(req, res) => {
      const email = req.query.email
      const result = await vehiclesCollection.find({ userEmail: email }).toArray();
      res.send(result);
    })

    // My bookings APIs
    app.post('/bookings', async(req, res) => {
      const data = req.body
      const result = await bookingsCollection.insertOne(data);
      res.send(result)
    })

    app.get('/myBookings', async (req, res) => {
      const email = req.query.email
      const result = await bookingsCollection.find({ booked_by: email }).toArray()
      res.send(result)
    })

    // Post APIs
    app.post('/vehicles', async(req, res) => {
      const data = req.body;
      // console.log(data)
      const result = await vehiclesCollection.insertOne(data)

      res.send({
        success: true,
        result
      })
    })

    // Update APIs
    app.put('/vehicles/:id', async (req, res) => {
      const { id } = req.params
      const data = req.body
      // console.log(id)
      // console.log(data)
      const objectId = new ObjectId(id)
      const filter = { _id: objectId }
      const update = { $set: data }
      
      const result = await vehiclesCollection.updateOne(filter, update)
      res.send({
        success: true,
        result
      })
    })

    // Delete APIs
    app.delete('/vehicles/:id', async(req, res) => {
      const { id } = req.params
      // console.log(id)
      const objectId = new ObjectId(id)
      const filter = { _id: objectId }

      const result = await vehiclesCollection.deleteOne(filter)
      res.send({
        success: true,
        result
      })
    })

    // Latest 6 data
    app.get('/latestVehicles', async(req, res)=>{
      const result = await vehiclesCollection.find().sort({ createdAt: -1 }).limit(6).toArray();
      res.send(result)
    })

    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`TravelEase server running is ${port}`)
})
