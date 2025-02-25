// const { MongoClient, ObjectId } = require('mongodb');

// // Connect to MongoDB Atlas (use your connection string from the environment variables)
// const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
// let collection;

// async function connectToMongo() {
//   try {
//     if (!client.isConnected()) {
//       await client.connect();
//     }
//     const db = client.db("inventory");  // Replace with your database name
//     collection = db.collection("stock");  // Replace with your collection name
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//     throw new Error("Failed to connect to MongoDB");
//   }
// }

// // Establish MongoDB connection when the function is first invoked
// connectToMongo();

// // GET route to fetch all products
// module.exports = async (req, res) => {
//   if (req.method === 'GET') {
//     try {
//       // Fetch all products from the database
//       const products = await collection.find({}).toArray();
//       res.status(200).json(products);  // Return the products as a JSON response
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       res.status(500).json({ error: "Failed to fetch products" });
//     }
//   } else if (req.method === 'DELETE') {
//     // Handle DELETE request to remove a product
//     const { productId } = req.query;
    
//     try {
//       if (!ObjectId.isValid(productId)) {
//         return res.status(400).json({ error: 'Invalid product ID' });
//       }

//       const result = await collection.deleteOne({ _id: new ObjectId(productId) });
      
//       if (result.deletedCount === 0) {
//         return res.status(404).json({ error: 'Product not found' });
//       }

//       res.status(200).json({ message: 'Product deleted successfully' });
//     } catch (error) {
//       console.error('Error deleting product:', error);
//       res.status(500).json({ error: "Failed to delete product" });
//     }
//   } else {
//     // Handle unsupported methods
//     res.status(405).json({ error: 'Method Not Allowed' });
//   }
// };
