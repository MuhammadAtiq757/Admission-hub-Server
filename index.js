const express = require('express');
const cors = require('cors');


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
const corsOptions ={
  origin:'*', 
  credentials:true,
  optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use(express.json());





const uri = "mongodb+srv://admission-hub:qs7QiDDkKt6yUZI6@cluster0.ytvhn6h.mongodb.net/?retryWrites=true&w=majority";

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

const collegeCollection = client.db('collegeCollection').collection('collection');

const addingCollection = client.db('addinfo').collection('add');

app.get('/collegeData', async (req, res) => {
  const cursor = collegeCollection.find();
  const result = await cursor.toArray();
  res.send(result);
});


app.get('/collegeData/:id' , async(req,res)=>{
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await collegeCollection.findOne(query);
  res.send(result);
});



app.get('/myInfo/:email', async(req, res)=>{
  const email = req.params.email;
  const filter = {userEmail : email}
  const result = await addingCollection.find(filter).toArray();
  res.send(result);
  })


  app.get("/findName/:text", async (req, res) => {
    const text = req.params.text;
    const result = await collegeCollection.find({
        $or: [
          { name: { $regex: text, $options: "i" } },
         
        ],
      })
      .toArray();
    res.send(result);
  });



app.post('/addInfo', async(req, res) => {
  const adding = req.body;
  const result = await addingCollection.insertOne(adding)
  res.send(result)
  // console.log(adding);
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




// user= admission-hub
// pass = qs7QiDDkKt6yUZI6





app.get('/', (req, res) =>{
    res.send('Admission hub is running')
})

app.listen(port, () =>{
    console.log(`Toys server is Running on port ${port}`);
})