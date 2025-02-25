// require("dotenv").config();
// const express = require("express");
// const { MongoClient, ObjectId } = require("mongodb");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const path = require("path");

// const URI = process.env.MONGODB_URI;
// const client = new MongoClient(URI);

// let productsCollection;

// const app = express();
// const port = 5500;

// app.use(express.json());
// app.use(cors());
// app.use(bodyParser.json());

// async function connectToMongo() {
//   try {
//     await client.connect();
//     console.log("Connected to MongoDB!");
//     const db = client.db("inventory"); 
//     productsCollection = db.collection("stock"); 
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//     throw error; 
//   }
// }

// // Connect to MongoDB before starting the Express server
// connectToMongo().then(() => {
//   // Once the base connection is successful, set up the routes

//   // Route to fetch all products
//   app.get("/api/products", async (req, res) => {
//     try {
//       const products = await productsCollection.find({}).toArray(); // Fetch products from DB
//       res.json(products); // Send products as JSON response
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       res.status(500).json({ error: "Failed to fetch products" });
//     }
//   });

//   // Route to delete a product
//   app.delete("/api/products/:id", async (req, res) => {
//     const { id } = req.params;

//     try {
//       if (!ObjectId.isValid(id)) {
//         return res.status(400).json({ error: "Invalid product ID" });
//       }

//       const result = await productsCollection.deleteOne({ _id: new ObjectId(id) });

//       if (result.deletedCount === 0) {
//         return res.status(404).json({ error: "Product not found" });
//       }

//       res.status(200).json({ message: "Product deleted successfully" });
//     } catch (error) {
//       console.error("Error deleting product:", error);
//       res.status(500).json({ error: "Failed to delete product" });
//     }
//   });

//   // Serve static files (HTML, CSS, JS files)
//   app.use(express.static(path.join(__dirname, "../public")));

//   // Start the server after successfully connecting to MongoDB
//   app.listen(port, () => {
//     console.log(`Server Listining at http://localhost:${port}`);
//   });
// });

// // Route to add a new product
// app.post("/api/products", async (req, res) => {
//   const { productName, quantity, purchasePrice, sellingPrice, receivedDate } = req.body;

//   try {
//     // Create new product object
//     const newProduct = {
//       productName,
//       quantity,
//       purchasePrice,
//       sellingPrice,
//       receivedDate: new Date(receivedDate || Date.now()).toISOString(), // Default to today if no date
//     };

//     // Insert the product into MongoDB
//     const result = await productsCollection.insertOne(newProduct);

//     // Check if insertion was successful
//     if (result.acknowledged) {
//       // Return the inserted product, including the newly generated _id
//       const insertedProduct = { ...newProduct, _id: result.insertedId };
//       res.status(201).json(insertedProduct); // Respond with the added product
//     } else {
//       res.status(500).json({ error: "Failed to add product" });
//     }
//   } catch (error) {
//     console.error("Error adding product:", error);
//     res.status(500).json({ error: "Failed to add product" });
//   }
// });

// // Route to update product quantity
// app.put("/api/products/:id", async (req, res) => {
//   const { id } = req.params;
//   const { quantity } = req.body;

//   try {
//     if (!ObjectId.isValid(id)) {
//       return res.status(400).json({ error: "Invalid product ID" });
//     }

//     // Find the product and update its quantity
//     const result = await productsCollection.updateOne(
//       { _id: new ObjectId(id) },
//       { $inc: { quantity: quantity } }  // Increment by quantity provided
//     );

//     if (result.modifiedCount === 0) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     // Fetch the updated product from the database
//     const updatedProduct = await productsCollection.findOne({ _id: new ObjectId(id) });

//     res.status(200).json(updatedProduct); // Send back the updated product
//   } catch (error) {
//     console.error("Error updating product:", error);
//     res.status(500).json({ error: "Failed to update product" });
//   }
// });

// // Route to sell product (decrease quantity)
// app.put("/api/products/sell/:id", async (req, res) => {
//   const { id } = req.params;
//   const { soldQuantity } = req.body;

//   try {
//     // Validate the product ID
//     if (!ObjectId.isValid(id)) {
//       return res.status(400).json({ error: "Invalid product ID" });
//     }

//     // Find the product
//     const product = await productsCollection.findOne({ _id: new ObjectId(id) });

//     // If product not found, return 404
//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     // Check if enough stock is available
//     if (product.quantity < soldQuantity) {
//       return res.status(400).json({ error: "Not enough stock to sell" });
//     }

//     // Decrease the quantity by soldQuantity
//     const result = await productsCollection.updateOne(
//       { _id: new ObjectId(id) },
//       { $inc: { quantity: -soldQuantity } }  // Decrement quantity by soldQuantity
//     );

//     if (result.modifiedCount === 0) {
//       return res.status(404).json({ error: "Product not found or no changes made" });
//     }

//     // Return success message
//     res.status(200).json({ message: "Product sold successfully" });
//   } catch (error) {
//     console.error("Error selling product:", error);
//     res.status(500).json({ error: "Failed to sell product" });
//   }
// });


// require("dotenv").config();
// const express = require("express");
// const { MongoClient, ObjectId } = require("mongodb");


// const URI = process.env.MONGODB_URI;
// const client = new MongoClient(URI);

// let productsCollection;

// // MongoDB connection function
// async function connectToMongo() {
//   try {
//     await client.connect();
//     console.log("Connected to MongoDB!");
//     const db = client.db("inventory");
//     productsCollection = db.collection("stock");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//     throw error;
//   }
// }

// // Express router
// const router = express.Router();

// // Middleware to check MongoDB connection
// router.use(async (req, res, next) => {
//   try {
//     if (!productsCollection) {
//       await connectToMongo();  // Ensure connection is established before any route
//     }
//     next(); // Continue to the route handler if MongoDB connection is ready
//   } catch (error) {
//     res.status(500).json({ error: "MongoDB connection failed" });
//   }
// });

// // Route to fetch all products
// router.get("/api/products", async (req, res) => {
//   try {
//     const products = await productsCollection.find({}).toArray();
//     res.json(products); // Send products as JSON response
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ error: "Failed to fetch products" });
//   }
// });

// // Route to delete a product
// router.delete("/api/products/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     if (!ObjectId.isValid(id)) {
//       return res.status(400).json({ error: "Invalid product ID" });
//     }

//     const result = await productsCollection.deleteOne({ _id: new ObjectId(id) });

//     if (result.deletedCount === 0) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     res.status(200).json({ message: "Product deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting product:", error);
//     res.status(500).json({ error: "Failed to delete product" });
//   }
// });

// // Route to add a new product
// router.post("/api/products", async (req, res) => {
//   const { productName, quantity, purchasePrice, sellingPrice, receivedDate } = req.body;

//   try {
//     const newProduct = {
//       productName,
//       quantity,
//       purchasePrice,
//       sellingPrice,
//       receivedDate: new Date(receivedDate || Date.now()).toISOString(),
//     };

//     const result = await productsCollection.insertOne(newProduct);

//     if (result.acknowledged) {
//       const insertedProduct = { ...newProduct, _id: result.insertedId };
//       res.status(201).json(insertedProduct);
//     } else {
//       res.status(500).json({ error: "Failed to add product" });
//     }
//   } catch (error) {
//     console.error("Error adding product:", error);
//     res.status(500).json({ error: "Failed to add product" });
//   }
// });

// // Route to update product quantity
// router.put("/api/products/:id", async (req, res) => {
//   const { id } = req.params;
//   const { quantity } = req.body;

//   try {
//     if (!ObjectId.isValid(id)) {
//       return res.status(400).json({ error: "Invalid product ID" });
//     }

//     const result = await productsCollection.updateOne(
//       { _id: new ObjectId(id) },
//       { $inc: { quantity: quantity } }
//     );

//     if (result.modifiedCount === 0) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     const updatedProduct = await productsCollection.findOne({ _id: new ObjectId(id) });
//     res.status(200).json(updatedProduct);
//   } catch (error) {
//     console.error("Error updating product:", error);
//     res.status(500).json({ error: "Failed to update product" });
//   }
// });

// // Route to sell product (decrease quantity)
// router.put("/api/products/sell/:id", async (req, res) => {
//   const { id } = req.params;
//   const { soldQuantity } = req.body;

//   try {
//     if (!ObjectId.isValid(id)) {
//       return res.status(400).json({ error: "Invalid product ID" });
//     }

//     const product = await productsCollection.findOne({ _id: new ObjectId(id) });

//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     if (product.quantity < soldQuantity) {
//       return res.status(400).json({ error: "Not enough stock to sell" });
//     }

//     const result = await productsCollection.updateOne(
//       { _id: new ObjectId(id) },
//       { $inc: { quantity: -soldQuantity } }
//     );

//     if (result.modifiedCount === 0) {
//       return res.status(404).json({ error: "Product not found or no changes made" });
//     }

//     res.status(200).json({ message: "Product sold successfully" });
//   } catch (error) {
//     console.error("Error selling product:", error);
//     res.status(500).json({ error: "Failed to sell product" });
//   }
// });

// // Set up Express server
// const app = express();
// const port = 5500;
// app.use(express.json());
// app.use(router);

// app.listen(port, () => {
//   console.log(`Server listening at http://localhost:${port}`);
// });

require("dotenv").config(); // To load environment variables from .env file
const express = require("express"); // Express framework
const { MongoClient, ObjectId } = require("mongodb"); // MongoDB client and ObjectId
const path = require("path");

// MongoDB URI from environment variables
const URI = process.env.MONGODB_URI;
const client = new MongoClient(URI); // MongoClient instance

let productsCollection; // To store the MongoDB collection reference

// Create the app instance first
const app = express();

// MongoDB connection function
async function connectToMongo() {
  try {
    await client.connect(); // Connect to MongoDB
    console.log("Connected to MongoDB!"); // Log success message
    const db = client.db("inventory"); // Access the 'inventory' database
    productsCollection = db.collection("stock"); // Reference the 'stock' collection
  } catch (error) {
    console.error("Error connecting to MongoDB:", error); // Log any errors
    throw error; // Rethrow the error if connection fails
  }
}

// Middleware to check MongoDB connection before handling any requests
app.use(async (req, res, next) => {
  try {
    if (!productsCollection) {
      await connectToMongo();  // Ensure connection is established before any route
    }
    next(); // Continue to the route handler if MongoDB connection is ready
  } catch (error) {
    res.status(500).json({ error: "MongoDB connection failed" }); // Respond with error if MongoDB connection fails
  }
});

// app.use(express.static(path.join(__dirname, "..public")));
app.use(express.static(path.join(__dirname, "../public")));

// Add a route to explicitly serve index.html for the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


// API route to fetch all products from the database
app.get("/api/products", async (req, res) => {
  try {
    const products = await productsCollection.find({}).toArray(); // Fetch all products from 'stock' collection
    res.json(products); // Send the products as a JSON response
  } catch (error) {
    console.error("Error fetching products:", error); // Log any errors
    res.status(500).json({ error: "Failed to fetch products" }); // Respond with error message
  }
});

app.get("/", (req, res) => {
  res.send("Server is running!"); // Send a message indicating the server is working
});


// Set up the Express server to listen on port 5500
const port = 5500;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`); // Log the server URL
});
