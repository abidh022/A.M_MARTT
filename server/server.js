require("dotenv").config();
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const URI = process.env.MONGODB_URI;
const client = new MongoClient(URI);

let productsCollection;

// Initialize express app
const app = express();
const port = process.env.PORT || 5500;

// Use express JSON middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB and retrieve the products collection
async function connectToMongo() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    const db = client.db("inventory"); // Database name (change as needed)
    productsCollection = db.collection("stock"); // Collection name (change as needed)

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process if MongoDB connection fails
  }
}

// Connect to MongoDB before starting the Express server
connectToMongo().then(() => {
  // Once the database connection is successful, set up the routes

  // Route to fetch all products
  app.get("https://noorstores.vercel.app/api/products", async (req, res) => {
    try {
      const products = await productsCollection.find({}).toArray(); // Fetch products from DB
      res.json(products); // Send products as JSON response
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Route to delete a product
  app.delete("/api/products/:id", async (req, res) => {
    const { id } = req.params;

    try {
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      const result = await productsCollection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Serve static files (HTML, CSS, JS files)
  app.use(express.static(path.join(__dirname, "../public")));

  app.get("/", (req, res) => {
    res.send("Welcome to the Stock API!");
  });
  

  // Start the server after successfully connecting to MongoDB
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

// Route to add a new product
app.post("/api/products", async (req, res) => {
  const { productName, quantity, purchasePrice, sellingPrice, receivedDate } = req.body;

  try {
    // Create new product object
    const newProduct = {
      productName,
      quantity,
      purchasePrice,
      sellingPrice,
      receivedDate: new Date(receivedDate || Date.now()).toISOString(), // Default to today if no date
    };

    // Insert the product into MongoDB
    const result = await productsCollection.insertOne(newProduct);

    // Check if insertion was successful
    if (result.acknowledged) {
      // Return the inserted product, including the newly generated _id
      const insertedProduct = { ...newProduct, _id: result.insertedId };
      res.status(201).json(insertedProduct); // Respond with the added product
    } else {
      res.status(500).json({ error: "Failed to add product" });
    }
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    // Find the product and update its quantity
    const result = await productsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { quantity: quantity } }  // Increment by quantity provided
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Fetch the updated product from the database
    const updatedProduct = await productsCollection.findOne({ _id: new ObjectId(id) });

    res.status(200).json(updatedProduct); // Send back the updated product
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

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

//     res.status(200).json({ message: "Product quantity updated" });
//   } catch (error) {
//     console.error("Error updating product:", error);
//     res.status(500).json({ error: "Failed to update product" });
//   }
// });


// Route to sell product (decrease quantity)
app.put("/api/products/sell/:id", async (req, res) => {
  const { id } = req.params;
  const { soldQuantity } = req.body;

  try {
    // Validate the product ID
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    // Find the product
    const product = await productsCollection.findOne({ _id: new ObjectId(id) });

    // If product not found, return 404
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if enough stock is available
    if (product.quantity < soldQuantity) {
      return res.status(400).json({ error: "Not enough stock to sell" });
    }

    // Decrease the quantity by soldQuantity
    const result = await productsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { quantity: -soldQuantity } }  // Decrement quantity by soldQuantity
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Product not found or no changes made" });
    }

    // Return success message
    res.status(200).json({ message: "Product sold successfully" });
  } catch (error) {
    console.error("Error selling product:", error);
    res.status(500).json({ error: "Failed to sell product" });
  }
});

