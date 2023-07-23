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
    const userCollection = client.db('collegeTask').collection('userInfo')
    const ratingCollection = client.db('collegeTask').collection('ratingReview')

    app.get('/clgInfo', async (req, res) => {
      const result = await collegeCollection.find().toArray();
      res.send(result);
    })
    app.get('/clgInfo', async (req, res) => {
      console.log(req.query);
      const result = await collegeCollection.find().toArray();
      res.send(result);
    })
    app.get('/clgInfo/:id', async (req, res) => {
      const id = req.params.id;
      const result = await collegeCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    })

 
    app.post('/candidateData',async(req, res) => {
    const body=req.body;
    const result=candidateInfoCollection.insertOne(body)
    res.send(result);
    })
    app.get('candidateData',async(req, res) => {
    const result=await candidateInfoCollection.find().toArray();
    res.send(result);
    })
    app.get('/candidateData/:id',async(req, res) => {
      id=req.params.id;
    const result=await candidateInfoCollection.findOne({ _id: new ObjectId(id) });
    res.send(result);
    })
    app.get('/candidateData',async(req, res) => {
      let query={};
      if(req.query?.email){
      query={email:req.query.email}
      }
      const result=await candidateInfoCollection.find(query).toArray();
      res.send(result);
      
    })

    app.post('/ratingreview',async(req, res) => {
    const body=req.body;
    const result=await ratingCollection.insertOne(body)
    res.send(result);
    })
    app.get('/ratingreview',async(req, res) => {
    const result=await ratingCollection.find().toArray();
    res.send(result);
    })
    app.get('/collegeSearch', async (req, res) => {
      const searchQuery = req.query.q;
    
      if (!searchQuery) {
        return res.status(400).json({ error: 'Search query is required.' });
      }
    
      try {
        const regex = new RegExp(searchQuery, 'i');
        const result = await collegeCollection.find({ collegeName: regex }).toArray();
    
        if (result.length === 0) {
          return res.status(404).json({ error: 'No matching college found.' });
        }
    
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while searching for colleges.' });
      }
    });

    


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
