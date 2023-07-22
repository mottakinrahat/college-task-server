const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dujofhq.mongodb.net/?retryWrites=true&w=majority`;

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

    const collegeCollection = client.db('collegeTask').collection('clgInfo')
    const candidateCollection = client.db('collegeTask').collection('candidateData')
    const candidateInfoCollection = client.db('collegeTask').collection('candidateInfo')

    app.get('/clgInfo', async (req, res) => {
      const result = await collegeCollection.find().toArray();
      res.send(result);
    })
    app.get('/clgInfo/:id', async (req, res) => {
      const id = req.params.id;
      const result = await collegeCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    })
    app.get('/candidateInfo', async (req, res) => {
      const result = await candidateCollection.find().toArray();
      res.send(result);
    })
    app.get('/candidateInfo/:id', async (req, res) => {
      const id = req.params.id;
      const result = await candidateCollection.findOne({_id:new ObjectId(id)});
      res.send(result);
    })

    app.post('/candidateData',async(req, res) => {
    const body=req.body;
    const result=candidateInfoCollection.insertOne(body)
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
  res.send('college is running ');
});

app.listen(port, () => {
  console.log(`port is running on ${port}`);
});