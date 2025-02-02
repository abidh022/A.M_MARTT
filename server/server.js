require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Initialize express app
const app = express();
const port = process.env.PORT || 5500;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas connection string
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Database and collection references
let db;
let collection;

async function connectToMongo() {
  try {
    await client.connect(); // Establish MongoDB connection
    console.log("Connected to MongoDB!");
    
    db = client.db("inventory"); // Set your database name here
    collection = db.collection("stock"); // Set your collection name here

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process if the connection fails
  }
}

// Call the function to connect to MongoDB when the server starts
connectToMongo();

// Helper function to fetch all products
async function getProducts() {
  try {
    const products = await collection.find({}).toArray();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Helper function to add a product
async function addProduct(product) {
  try {
    const result = await collection.insertOne(product);
    // Return the inserted product with the insertedId
    return { ...product, _id: result.insertedId };  // Attach the insertedId to the product
  } catch (error) {
    console.error("Error adding product:", error);
    throw new Error("Failed to add product");
  }
}

// Helper function to update a product
async function updateProduct(id, updatedProduct) {
  try {
    const result = await collection.updateOne(
      { _id: new MongoClient.ObjectId(id) },  // Use ObjectId for MongoDB primary key
      { $set: updatedProduct }
    );
    return result.modifiedCount > 0;  // Returns true if update was successful
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
}

// Helper function to delete a product
async function deleteProduct(id) {
  try {
    // Use ObjectId to convert the string id into a valid ObjectId
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;  // Returns true if the product was deleted
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
}
// Serve static files (the HTML, CSS, JS files in the "public" directory)
app.use(express.static(path.join(__dirname, '../public')));

// Serve the homepage route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API endpoint to fetch all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// API endpoint to add a product
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = req.body;
    const addedProduct = await addProduct(newProduct);
    res.status(201).json(addedProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to add product" });
  }
});

// API endpoint to update a product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = req.body;
    const success = await updateProduct(id, updatedProduct);
    if (success) {
      res.json({ message: "Product updated successfully" });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// API endpoint to delete a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await deleteProduct(id);
    if (success) {
      res.json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



// require('dotenv').config(); 
// const express = require('express');
// const { MongoClient } = require('mongodb');  // Import MongoClient from 'mongodb'
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const path = require('path');

// // Initialize express app
// const app = express();
// const port = process.env.PORT || 5500;


// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // MongoDB Atlas connection string (replace with your credentials)
// const uri = process.env.MONGODB_URI;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


// async function connectToMongo() {
//   try {
//     await client.connect();  // Establish MongoDB connection
//     console.log("Connected to MongoDB!");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//     process.exit(1);  // Exit process if the connection fails
//   }
// }
// connectToMongo();

// // Serve static files (the HTML, CSS, JS files in the "public" directory)
// app.use(express.static(path.join(__dirname, '../public')));

// // Serve the homepage route
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public/index.html'));
// });



// async function getDbData() {
//   try {
//     await client.connect();
//     console.log("Connected to MongoDB!");

//     const db = client.db("inventory");  // Replace with your database name
//     const collection = db.collection("stock");  // Replace with your collection name
//     const data = await collection.find({}).toArray();  // Fetch all documents

//     console.log("Fetched Data:", data);  // Log the fetched data for debugging
//     return data;
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);  // Detailed error message
//     return [];
//   } finally {
//     await client.close();  // Close the connection after operation
//   }
// }

// // Call the function for testing
// getDbData().then(data => {
//   console.log("Data from DB:", data);
// });

// app.get('/api/products', async (req, res) => {
//   const products = await getDbData();
//   res.json(products);
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// app.post('/api/add-product', async (req, res) => {
//   try {
//     const product = req.body;
    
//     // Validate the received data
//     if (!product.name || !product.quantity || !product.price || !product.receivedDate) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }

//     // Insert product into MongoDB
//     const db = client.db("inventory"); // replace with your DB name
//     const collection = db.collection("stock"); // replace with your collection name
//     const result = await collection.insertOne(product);

//     // Return the inserted product data
//     res.status(201).json(result.ops[0]); // Respond with the inserted product
//   } catch (error) {
//     console.error("Error adding product:", error);
//     res.status(500).json({ error: 'Failed to add product' });
//   }
// });

// // Route to get all products from the database


// app.post('/api/add-product', async (req, res) => {
//   try {
//     const product = req.body;
    
//     // Validate the received data
//     if (!product.name || !product.quantity || !product.price || !product.receivedDate) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }

//     // Check if connection is still open
//     if (!client.isConnected()) {
//       return res.status(500).json({ error: 'MongoDB client not connected' });
//     }

//     // Insert product into MongoDB
//     const db = client.db("inventory");  // replace with your DB name
//     const collection = db.collection("stock");  // replace with your collection name
//     const result = await collection.insertOne(product);

//     console.log('Product inserted:', result.ops[0]);  // Log the inserted product for debugging

//     // Return the inserted product data
//     res.status(201).json(result.ops[0]); // Respond with the inserted product
//   } catch (error) {
//     console.error("Error adding product:", error);  // Log the error details
//     res.status(500).json({ error: 'Failed to add product' });
//   }
// });



