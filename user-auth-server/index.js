const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['https://user-auth-client-9am.vercel.app', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Welcome');
});

// Middleware to check JWT token
const verifyJWT = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized Access! Token not found in cookies.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

// MongoDB Connection
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@simple-crud-server.ql3nn36.mongodb.net/?retryWrites=true&w=majority&appName=Simple-CRUD-server`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    const database = client.db('User-Auth');
    const userCollection = database.collection('user-register');

    // Signup api
    app.post('/signup', async (req, res) => {
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

    // Signin api
    app.post('/signin', async (req, res) => {
      try {
        const { username, password, rememberMe } = req.body;

        if (!username || !password) {
          return res.status(400).json({ message: 'Username and password are required.' });
        }

        const user = await userCollection.findOne({ username });

        if (!user) {
          return res.status(404).json({ message: 'User not found.' });
        }

        if (user.password !== password) {
          return res.status(401).json({ message: 'Incorrect password.' });
        }

        const payload = {
          userId: user._id,
          username: user.username,
          shops: user.shops,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: rememberMe ? '7d' : '30m',
        });

        res.cookie('token', token, {
          httpOnly: true,
          secure: true, 
        });

        res.status(200).json({
          message: 'Login successful!',
          user: {
            username: user.username,
            shops: user.shops,
          },
        });
      } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ message: 'Internal server error.' });
      }
    });

    // Get user info
    app.get('/user', verifyJWT, async (req, res) => {
      try {
        const { username } = req.user;

        const user = await userCollection.findOne(
          { username },
          { projection: { password: 0 } }
        );

        if (!user) {
          return res.status(404).json({ message: 'User not found.' });
        }

        res.json({ user });
      } catch (err) {
        console.error('User fetch error:', err);
        res.status(500).json({ message: 'Server error.' });
      }
    });

    // Logout api
    app.post('/logout', (req, res) => {
      res.clearCookie('token', {
        httpOnly: true,
        secure: false,
      });
      res.status(200).json({ message: 'Logged out successfully.' });
    });

    // Ping MongoDB
    // await client.db('admin').command({ ping: 1 });
    // console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
