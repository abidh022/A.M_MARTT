// const addProductBtn = document.getElementById("addProductBtn");
// const popup = document.getElementById("popup");
// const closeBtn = document.getElementById("closeBtn");
// const productForm = document.getElementById("productForm");

// const productNameInput = document.getElementById('productName');
// const quantityInput = document.getElementById('quantity');
// const purchasePriceInput = document.getElementById('purchasePrice');
// const sellingPriceInput = document.getElementById('sellingPrice');
// const receivedDateInput = document.getElementById('receivedDate');

// // Update Product Pop-up Elements
// const updatePopup = document.getElementById("updatePopup");
// const closeUpdateBtn = document.getElementById("closeUpdateBtn");
// const updateForm = document.getElementById("updateForm");
// const updateQuantity = document.getElementById("updateQuantity");
// const updateReceivedDate = document.getElementById("updateReceivedDate");

// // Sell Product Pop-up Elements
// const sellPopup = document.getElementById("sellPopup");
// const closeSellBtn = document.getElementById("closeSellBtn");
// const sellForm = document.getElementById("sellForm");

// // Search Bar Element
// const searchBar = document.getElementById("searchBar");
// const stockTableBody = document.querySelector("#stockTable tbody");

// // Store products in an array
// let products = [];
// let filteredProducts = [];  // New array to store filtered products
// let currentProductIndex = null;  // To keep track of the product being updated

// // Open Add Product popup and set today's date as default in the receivedDate input
// addProductBtn.addEventListener('click', function () {
//   popup.style.display = "block";
//   productForm.reset(); // Reset form to ensure inputs are cleared
//   const receivedDateInput = document.getElementById("receivedDate");
//   receivedDateInput.value = new Date().toISOString().split('T')[0]; // Today's date
// });

// // Close Add Product pop-up
// closeBtn.addEventListener("click", () => {
//   popup.style.display = "none";
// });

// function formatDate(dateString) {
//   const date = new Date(dateString);
//   const day = String(date.getDate()).padStart(2, '0');  // Ensure two-digit day
//   const month = String(date.getMonth() + 1).padStart(2, '0');  // Ensure two-digit month
//   const year = date.getFullYear();
//   return `${day}-${month}-${year}`;
// }

// // Open Update Product popup
// function openUpdatePopup(index) {
//   const product = filteredProducts[index];
//   currentProductIndex = index;  // Set the index for the product to be updated
//   // const product = products[index];
  
//   // Set default values for update fields (quantity, received date)
//   updateQuantity.value = '';
//   updateReceivedDate.value = new Date().toISOString().split('T')[0]; // Default today's date

//   updateForm.onsubmit = function(event) {
//     event.preventDefault();
//     updateProduct(index);
//   };
//   updatePopup.style.display = "block";
// }

// // Close Update pop-up
// closeUpdateBtn.addEventListener("click", () => {
//   updatePopup.style.display = "none";
// });

// // Open Sell Product popup
// function openSellPopup(index) {
//   sellForm.onsubmit = function(event) {
//     event.preventDefault();
//     sellProduct(index);
//   };
//   sellPopup.style.display = "block";
// }

// // Close Sell pop-up
// closeSellBtn.addEventListener("click", () => {
//   sellPopup.style.display = "none";
// });

// // Handle form submission for adding product
// productForm.addEventListener("submit", function(event) {
//   event.preventDefault();
  
//   const productName = productNameInput.value.trim();  // Ensure no empty spaces
//   const quantity = parseInt(quantityInput.value);
//   const purchasePrice = parseFloat(purchasePriceInput.value);
//   const sellingPrice = parseFloat(sellingPriceInput.value);
//   const receivedDate = receivedDateInput.value;


//   // Prepare the product data to send in the request body
//   const productData = {
//     productName,
//     quantity,
//     purchasePrice,
//     sellingPrice,
//     receivedDate
//   };

//   // Send a POST request to the server to add the product
//   fetch('/api/products', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(productData)
//   })
//   .then(response => response.json())
//   .then(data => {
//     console.log('Product added:', data);
//     // alert('Product added successfully!');
//     products.push(data);
//     popup.style.display = "none";
//     productForm.reset();
//     updateTable(); // Refresh the table to reflect the new product
//   })
//   .catch(error => {
//     console.error('Error adding product:', error);
//     alert('Failed to add product.');
//   });
// });

// // Update product data (only quantity)
// function updateProduct(index) {
//   const newQuantity = parseInt(updateQuantity.value);

//   // If quantity is valid, add the new quantity to the existing quantity
//   if (newQuantity) {
//     // Add the new quantity value to the existing quantity
//     const updatedProduct = {
//       ...products[index],
//       quantity: newQuantity,
//       receivedDate: updateReceivedDate.value  // Optionally, we can also update the received date
//     };

//     fetch(`/api/products/${products[index]._id}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(updatedProduct)
//     })
//     .then(response => response.json())
//     .then(data => {
//       console.log('Product updated:', data);

//       // Replace the updated product in the products array with the new data
//       products[index] = data;  // Replace with the updated product
//       filteredProducts[index] = data; // Update filtered products if applicable

//       // Re-render the table to reflect the updated product
//       updateTable();  // This function should re-render the table using the updated data

//       // Close the update popup or modal (if you're using one)
//       updatePopup.style.display = "none";
//     })
//     .catch(error => {
//       console.error('Error updating product:', error);
//       alert('Failed to update product.');
//     });
//   } else {
//     alert("Please enter a valid quantity to update!");
//   }
// }

// // sell
// function sellProduct(index) {
//   const sellQuantity = parseInt(document.getElementById("sellQuantity").value);

//   if (sellQuantity <= products[index].quantity) {
//     // Decrease the product quantity in the frontend first
//     filteredProducts[index].quantity -= sellQuantity;  // 
//     // Send the sell request to the backend to update the quantity
//     fetch(`/api/products/sell/${products[index]._id}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ soldQuantity: sellQuantity })  // Send the sold quantity to the backend
//     })
//     .then(response => response.json())
//     .then(data => {
//       console.log('Product sold:', data);
//       // Optionally show an alert or message
//       // alert('Product sold successfully!');
//       updateTable();  // Refresh the table with the updated data
//       sellPopup.style.display = "none";  // Close the popup
//     })
//     .catch(error => {
//       console.error('Error selling product:', error);
//       alert('Failed to sell product.');
//     });
//   } else {
//     alert("Not enough stock to sell!");
//   }
// }

// // Delete product
// // Delete product
// function deleteProduct(id) {
//   const confirmDelete = confirm("Are you sure you want to delete this product?");
//   if (confirmDelete) {
//     fetch(`/api/products/${id}`, {
//       method: 'DELETE'
//     })
//     .then(response => response.json())
//     .then(data => {
//       console.log('Product deleted:', data);
      
//       // Remove the deleted product from the `products` array and `filteredProducts` array
//       products = products.filter(product => product._id !== id);  // Remove from the products array
//       filteredProducts = filteredProducts.filter(product => product._id !== id);  // Remove from the filteredProducts array (if applicable)

//       // Refresh the table immediately after deletion
//       updateTable(); // This function should re-render the table using the updated data
//     })
//     .catch(error => {
//       console.error('Error deleting product:', error);
//       alert('Failed to delete product.');
//     });
//   }
// }


// function fetchProducts() {
//   fetch('/api/products') // Get products from server
//     .then(response => response.json())
//     .then(data => {
//       products = data; // Store products from server
//       filteredProducts = data;  // Initially, display all products
//       console.log(products.data);
//       console.log(data,"dvuue");

      
//       updateTable(); // Display all products initially
//     })
//     .catch(error => {
//       console.error("Error fetching products:", error);
//       alert('Failed to fetch products.');
//     });
// }


// // Update the table with all or filtered products
// function updateTable(filteredProducts = null) {
//   stockTableBody.innerHTML = ""; // Clear existing table rows

//   // Use the filtered products if available, otherwise fetch from the server
//   const productsToDisplay = filteredProducts || products;

//   // Loop through the filtered or full list of products
//   productsToDisplay.forEach((product, index) => {
//     const row = document.createElement("tr");

//     // Ensure valid numeric fields before using `.toFixed()`
//     const purchasePrice = product.purchasePrice && !isNaN(product.purchasePrice) ? product.purchasePrice : 0;
//     const sellingPrice = product.sellingPrice && !isNaN(product.sellingPrice) ? product.sellingPrice : 0;

//     // Create table row with safe values
//     row.innerHTML = `
//       <td>${product.productName}</td>
//       <td>${product.quantity}</td>
//       <td>${purchasePrice.toFixed(2)}</td>
//       <td>${sellingPrice.toFixed(2)}</td>
//       <td>${formatDate(product.receivedDate)}</td>
//       <td>
//         <button onclick="openUpdatePopup(${index})">Update</button>
//         <button onclick="openSellPopup(${index})">Sell</button>
//         <button onclick="deleteProduct('${product._id}')">Delete</button>
//       </td>
//     `;

//     stockTableBody.appendChild(row); // Add row to table
//   });
// }

// // Search functionality: Filter the products as the user types
// searchBar.addEventListener("input", function(event) {
//   const searchTerm = event.target.value.toLowerCase();

//   // Filter products based on product name (partial match)
//   const filteredProducts = products.filter(product => 
//     product.productName.toLowerCase().includes(searchTerm)
//   );

//   // Update the table with filtered products
//   updateTable(filteredProducts);
// });

// // Initial table load
// updateTable();
// fetchProducts();


const addProductBtn = document.getElementById("addProductBtn");
const popup = document.getElementById("popup");
const closeBtn = document.getElementById("closeBtn");
const productForm = document.getElementById("productForm");

const productNameInput = document.getElementById('productName');
const quantityInput = document.getElementById('quantity');
const purchasePriceInput = document.getElementById('purchasePrice');
const sellingPriceInput = document.getElementById('sellingPrice');
const receivedDateInput = document.getElementById('receivedDate');

// Update Product Pop-up Elements
const updatePopup = document.getElementById("updatePopup");
const closeUpdateBtn = document.getElementById("closeUpdateBtn");
const updateForm = document.getElementById("updateForm");
const updateQuantity = document.getElementById("updateQuantity");
const updateReceivedDate = document.getElementById("updateReceivedDate");

// Sell Product Pop-up Elements
const sellPopup = document.getElementById("sellPopup");
const closeSellBtn = document.getElementById("closeSellBtn");
const sellForm = document.getElementById("sellForm");

// Search Bar Element
const searchBar = document.getElementById("searchBar");
const stockTableBody = document.querySelector("#stockTable tbody");

// Store products in an array
let products = [];
let filteredProducts = [];  // New array to store filtered products
let currentProductIndex = null;  // To keep track of the product being updated

// Open Add Product popup and set today's date as default in the receivedDate input
addProductBtn.addEventListener('click', function () {
  popup.style.display = "block";
  productForm.reset(); // Reset form to ensure inputs are cleared
  const receivedDateInput = document.getElementById("receivedDate");
  receivedDateInput.value = new Date().toISOString().split('T')[0]; // Today's date
});

// Close Add Product pop-up
closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
});

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');  // Ensure two-digit day
  const month = String(date.getMonth() + 1).padStart(2, '0');  // Ensure two-digit month
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Open Update Product popup
function openUpdatePopup(filteredIndex) {
  const product = filteredProducts[filteredIndex];  // Get product from filtered list
  currentProductIndex = filteredIndex;  // Save the filtered index
  
  updateQuantity.value = '';  // Reset quantity
  updateReceivedDate.value = new Date().toISOString().split('T')[0]; // Default today's date

  updateForm.onsubmit = function(event) {
    event.preventDefault();
    updateProduct(filteredIndex);  // Pass the filtered index here
  };

  updatePopup.style.display = "block";
}

// Close Update pop-up
closeUpdateBtn.addEventListener("click", () => {
  updatePopup.style.display = "none";
});

// Open Sell Product popup
function openSellPopup(filteredIndex) {
  sellForm.onsubmit = function(event) {
    event.preventDefault();
    sellProduct(filteredIndex);  // Pass the filtered index here
  };
  sellPopup.style.display = "block";
}

// Close Sell pop-up
closeSellBtn.addEventListener("click", () => {
  sellPopup.style.display = "none";
});

// Handle form submission for adding product
productForm.addEventListener("submit", function(event) {
  event.preventDefault();
  
  const productName = productNameInput.value.trim();  // Ensure no empty spaces
  const quantity = parseInt(quantityInput.value);
  const purchasePrice = parseFloat(purchasePriceInput.value);
  const sellingPrice = parseFloat(sellingPriceInput.value);
  const receivedDate = receivedDateInput.value;


  // Prepare the product data to send in the request body
  const productData = {
    productName,
    quantity,
    purchasePrice,
    sellingPrice,
    receivedDate
  };

  // Send a POST request to the server to add the product
  fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productData)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Product added:', data);
    products.push(data);
    filteredProducts.push(data); // Add to filtered products too
    popup.style.display = "none";
    productForm.reset();
    updateTable(filteredProducts); // Refresh the table to reflect the new product
  })
  .catch(error => {
    console.error('Error adding product:', error);
    alert('Failed to add product.');
  });
});

// Update product data (only quantity)
function updateProduct(filteredIndex) {
  const newQuantity = parseInt(updateQuantity.value);

  if (newQuantity) {
    const updatedProduct = {
      ...filteredProducts[filteredIndex],  // Update based on filtered product
      quantity: newQuantity,
      receivedDate: updateReceivedDate.value  // Optionally, update the received date
    };

    fetch(`/api/products/${filteredProducts[filteredIndex]._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedProduct)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Product updated:', data);

      // Update both the original products array and the filtered list
      products = products.map(product => 
        product._id === data._id ? data : product  // Update the original array
      );
      filteredProducts = filteredProducts.map(product => 
        product._id === data._id ? data : product  // Update the filtered list
      );

      updateTable(filteredProducts);  // Use filtered products here
      updatePopup.style.display = "none";
    })
    .catch(error => {
      console.error('Error updating product:', error);
      alert('Failed to update product.');
    });
  } else {
    alert("Please enter a valid quantity to update!");
  }
}

// Sell product
function sellProduct(filteredIndex) {
  const sellQuantity = parseInt(document.getElementById("sellQuantity").value);

  if (sellQuantity <= filteredProducts[filteredIndex].quantity) {
    filteredProducts[filteredIndex].quantity -= sellQuantity;  // Update filtered quantity

    fetch(`/api/products/sell/${filteredProducts[filteredIndex]._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ soldQuantity: sellQuantity })  // Send the sold quantity to the backend
    })
    .then(response => response.json())
    .then(data => {
      console.log('Product sold:', data);

      // Update both the original products array and the filtered list
      products = products.map(product => 
        product._id === data._id ? data : product  // Update the original array
      );
      filteredProducts = filteredProducts.map(product => 
        product._id === data._id ? data : product  // Update the filtered list
      );

      updateTable(filteredProducts);  // Use filtered products here
      sellPopup.style.display = "none";
    })
    .catch(error => {
      console.error('Error selling product:', error);
      alert('Failed to sell product.');
    });
  } else {
    alert("Not enough stock to sell!");
  }
}

// Delete product
function deleteProduct(id) {
  const confirmDelete = confirm("Are you sure you want to delete this product?");
  if (confirmDelete) {
    fetch(`/api/products/${id}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      console.log('Product deleted:', data);
      
      products = products.filter(product => product._id !== id);  // Remove from the products array
      filteredProducts = filteredProducts.filter(product => product._id !== id);  // Remove from the filteredProducts array

      updateTable(filteredProducts); // Refresh the table immediately after deletion
    })
    .catch(error => {
      console.error('Error deleting product:', error);
      alert('Failed to delete product.');
    });
  }
}

function fetchProducts() {
  fetch('/api/products') // Get products from server
    .then(response => response.json())
    .then(data => {
      products = data; // Store products from server
      filteredProducts = data;  // Initially, display all products

      updateTable(filteredProducts); // Display all products initially
    })
    .catch(error => {
      console.error("Error fetching products:", error);
      alert('Failed to fetch products.');
    });
}

// Update the table with all or filtered products
function updateTable(filteredProducts = null) {
  stockTableBody.innerHTML = ""; // Clear existing table rows

  const productsToDisplay = filteredProducts || products; // Use filtered products if available

  productsToDisplay.forEach((product, index) => {
    const row = document.createElement("tr");

    const purchasePrice = product.purchasePrice && !isNaN(product.purchasePrice) ? product.purchasePrice : 0;
    const sellingPrice = product.sellingPrice && !isNaN(product.sellingPrice) ? product.sellingPrice : 0;

    row.innerHTML = `
      <td>${product.productName}</td>
      <td>${product.quantity}</td>
      <td>${purchasePrice.toFixed(2)}</td>
      <td>${sellingPrice.toFixed(2)}</td>
      <td>${formatDate(product.receivedDate)}</td>
      <td>
        <button onclick="openUpdatePopup(${index})">Update</button>
        <button onclick="openSellPopup(${index})">Sell</button>
        <button onclick="deleteProduct('${product._id}')">Delete</button>
      </td>
    `;

    stockTableBody.appendChild(row);
  });
}

// Search functionality: Filter the products as the user types
searchBar.addEventListener("input", function(event) {
  const searchTerm = event.target.value.toLowerCase();

  // Filter products based on product name (partial match)
  filteredProducts = products.filter(product => 
    product.productName.toLowerCase().includes(searchTerm)
  );

  // Update the table with filtered products
  updateTable(filteredProducts);
});

// Initial table load
fetchProducts();
