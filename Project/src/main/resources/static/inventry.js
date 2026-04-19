const BASE_URL = "http://localhost:8080"; // Tumhara Spring Boot port
 
let productToDeleteId = null; // Delete ke liye ID store karo
 
// 1. Page load hote hi data mangwao
document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
});
 
// 2. View All Products
async function loadProducts() {
    try {
        const response = await fetch(`${BASE_URL}/view_all`);
        const products = await response.json();
        renderTable(products);
    } catch (error) {
        console.error("Error loading products:", error);
    }
}
 
// 3. Search Product (Real-time)
async function searchProduct() {
    const query = document.getElementById("searchInput").value;
    
    if (query.trim() === "") {
        loadProducts();
        return;
    }
 
    try {
        const response = await fetch(`${BASE_URL}/search/${query}`);
        const products = await response.json();
        renderTable(products);
    } catch (error) {
        console.error("Search error:", error);
    }
}
 
// 4. Add Product (@PostMapping with RequestParam)
async function saveProduct() {
    const name = document.getElementById("newProductName").value;
 
    if (!name) {
        alert("Product name likho pehle!");
        return;
    }
 
    try {
        const response = await fetch(`${BASE_URL}/addProduct?name=${encodeURIComponent(name)}`, {
            method: 'POST'
        });
 
        // 1. Check if everything went well (Status 200-299)
       if (response.ok) {
                   // Hide error box if it was showing
                   document.getElementById("errorBox").style.display = "none";

                   document.getElementById("modalInputSection").style.display = "none";
                   document.getElementById("modalConfirmSection").style.display = "block";
                   document.getElementById("newProductName").value = "";
                   loadProducts();
               }
               else {
                   const errorData = await response.json();

                   // Get the UI elements
                   const errorBox = document.getElementById("errorBox");
                   const errorMessage = document.getElementById("errorMessage");

                   // Put the message in and show the box
                   errorMessage.innerText = "Nahi bhi! " + errorData.message;
                   errorBox.style.display = "block";
               }
    } catch (error) {
        // This only runs if the SERVER IS DOWN
        alert("Server se connection nahi ho pa raha.");
    }
}
// 5. Table Render Function
function renderTable(products) {
    const tbody = document.getElementById("productBody");
    tbody.innerHTML = "";
 
    products.forEach(product => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td class="td-actions">
                <button class="btn-delete-row" title="Delete" onclick="openDeleteModal(${product.id})">
                    <i class="fas fa-times"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}
 
// 6. Delete Functions
function openDeleteModal(id) {
    productToDeleteId = id;
    document.getElementById("deleteModal").style.display = "flex";
}
 
function closeDeleteModal() {
    productToDeleteId = null;
    document.getElementById("deleteModal").style.display = "none";
}
 
async function confirmDelete() {
    if (!productToDeleteId) return;
 
    try {
        const response = await fetch(`${BASE_URL}/delete/${productToDeleteId}`, {
            method: 'DELETE'
        });
 
        if (response.ok) {
            closeDeleteModal();
            loadProducts();
        } else {
            alert("Delete nahi hua, dobara try karo.");
        }
    } catch (error) {
        alert("Server se connection nahi hua.");
    }
}
 
// --- UI Helper Functions ---
 
function openModal() {
    // Reset modal to default state (input view)
        document.getElementById("newProductName").value = "";

        // 2. Hide the error box so it doesn't show the old message
        document.getElementById("errorBox").style.display = "none";

        // 3. Make sure the input section is visible (if you previously hid it)
        document.getElementById("modalInputSection").style.display = "block";
        document.getElementById("modalConfirmSection").style.display = "none";
        document.getElementById("modalInputSection").style.display = "block";
        document.getElementById("modalConfirmSection").style.display = "none";
        document.getElementById("addModal").style.display = "flex";
        document.getElementById("newProductName").focus();
}
 
function closeModal() {
    document.getElementById("addModal").style.display = "none";
}
 
// Modal band karne ke liye bahar click karo
window.onclick = function(event) {
    const addModal = document.getElementById("addModal");
    const deleteModal = document.getElementById("deleteModal");
    if (event.target == addModal) {
        closeModal();
    }
    if (event.target == deleteModal) {
        closeDeleteModal();
    }
}
 