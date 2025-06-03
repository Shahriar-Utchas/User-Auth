const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome')
})

//MongoDB Connection
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@simple-crud-server.ql3nn36.mongodb.net/?retryWrites=true&w=majority&appName=Simple-CRUD-server`;

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
    const database = client.db('User-Auth');
    const userCollection = database.collection('user-register');

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, password, shops } = req.body;

    if (!Array.isArray(shops) || shops.length < 3) {
      return res.status(400).json({ message: 'Please provide at least 3 shop names.' });
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters and include a number and special character.',
      });
    }

    const existingUser = await userCollection.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already taken.' });
    }

    const allUsers = await userCollection.find({}, { projection: { shops: 1 } }).toArray();
    const globalShopNames = new Set(
      allUsers.flatMap((u) => u.shops.map((s) => s.toLowerCase().trim()))
    );

    for (const shop of shops) {
      if (globalShopNames.has(shop.toLowerCase().trim())) {
        return res.status(409).json({ message: `Shop name "${shop}" is already in use.` });
      }
    }

    const newUser = {
      username,
      password, 
      shops,
      createdAt: new Date(),
    };

    await userCollection.insertOne(newUser);

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error.' });
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

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
