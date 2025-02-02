document.getElementById('addProductForm')?.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission
  
    // Collect the form data
    const product = {
      name: document.getElementById('name').value,
      quantity: document.getElementById('quantity').value,
      price: document.getElementById('price').value,
      receivedDate: document.getElementById('receivedDate').value,
    };
  
    // Validate the input
    if (!product.name || !product.quantity || !product.price || !product.receivedDate) {
      document.getElementById('error-message').textContent = 'All fields are required!';
      return;
    }
  
    // Make the POST request to add the product
    fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to add product');
        }
        return res.json();
      })
      .then((data) => {
        // Handle success
        document.getElementById('error-message').textContent = '';
        document.getElementById('success-message').textContent = 'Product added successfully!';
        
        // Clear the form fields
        document.getElementById('addProductForm').reset();
      })
      .catch((err) => {
        // Handle error
        document.getElementById('success-message').textContent = '';
        document.getElementById('error-message').textContent = err.message;
      });
  });

  
// View Products
window.onload = function() {
    if (window.location.pathname === '/view-products.html') {
      fetch('/api/products')
        .then(res => res.json())  
        .then(data => {
          const productList = document.getElementById('productList').getElementsByTagName('tbody')[0];
          data.forEach(product => {
            console.log(data);
            
            const row = productList.insertRow();
            row.insertCell(0).textContent = product.name;
            row.insertCell(1).textContent = product.quantity;
            row.insertCell(2).textContent = product.price;
            row.insertCell(3).textContent = product.receivedDate;
            const deleteCell = row.insertCell(4);
            deleteCell.innerHTML = `<button class="deleteBtn" onclick="deleteProduct('${product._id}')">Delete</button>`;
        });
      })
      .catch(err => {
        console.error("Error fetching products:", err);
      });
  }
};
  

// Function to delete a product
function deleteProduct(productId) {
    fetch(`/api/products/${productId}`, {
      method: 'DELETE',
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.message) {
        alert('Product deleted successfully');
        // Refresh the page to reload the product list
        location.reload();
      } else {
        alert('Error: ' + data.error);
      }
    })
    .catch((err) => {
      console.error('Error:', err);
      alert('Failed to delete product: ' + err.message);
    });
  }