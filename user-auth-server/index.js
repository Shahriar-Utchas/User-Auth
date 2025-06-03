const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 3000

// Middleware
app.use(cors({
    origin: ['http://localhost:5173'], 
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


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


// Signup
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


//signin
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { username, password, rememberMe } = req.body;

    const user = await userCollection.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const payload = {
      id: user._id,
      username: user.username,
      shops: user.shops,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: rememberMe ? '7d' : '30m',
    });

    // Set cookie options
    const cookieOptions = {
    httpOnly: true,
    secure: false,
};
    // Set the cookie
    res.cookie('token', token, cookieOptions);

    res.status(200).json({
      message: 'Login successful',
      user: {
        username: user.username,
        shops: user.shops,
      },
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/api/auth/verify', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ user: decoded });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

//logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
  });
  res.status(200).json({ message: 'Logged out successfully' });
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
