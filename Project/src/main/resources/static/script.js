let currentBillId = null;
let selectedProductId = null;

// 1. Search Logic - Matches ProductController (No prefix)
async function searchProducts() {
    const val = document.getElementById('productSearch').value;
    const resDiv = document.getElementById('searchResults');
    
    if (val.length < 1) { 
        resDiv.style.display = 'none'; 
        return; 
    }

    try {
        // Matches @GetMapping("search/{name}") in ProductController
        const response = await fetch(`http://localhost:8080/search/${val}`);
        const products = await response.json();

        resDiv.innerHTML = '';
        products.forEach(p => {
            const d = document.createElement('div');
            d.innerText = p.name; 
            d.onclick = () => selectProduct(p.id, p.name);
            resDiv.appendChild(d);
        });
        resDiv.style.display = 'block';
    } catch (e) { console.error("Search Error", e); }
}

function selectProduct(id, name) {
    selectedProductId = id;
    document.getElementById('productSearch').value = name;
    document.getElementById('searchResults').style.display = 'none';
    document.getElementById('priceInput').focus();
}

// 2. Add Button Logic
async function addItem() {
    const priceValue = document.getElementById('priceInput').value;
    if (!selectedProductId || !priceValue) {
        showModal("Missing Info", "Meharbani karke product select karein aur qeemat darj karein.", false);
        return;
    }
    // const priceValue = document.getElementById('priceInput').value;
    // if (!selectedProductId || !priceValue) return alert("Select product & enter price");

    try {
        // STEP 1: Create Bill - Matches @RequestMapping("/api/bills") + @PostMapping("create")
        if (!currentBillId) {
            const bRes = await fetch('http://localhost:8080/api/bills/create', { method: 'POST' });
            const bData = await bRes.json();
            currentBillId = bData.id;
        }

        // STEP 2: Add Item - Matches BillItemController (No prefix) + @PostMapping("/addItem")
        const payload = {
            billId: currentBillId,
            productId: selectedProductId,
            price: parseFloat(priceValue)
        };

        const addRes = await fetch('http://localhost:8080/addItem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (addRes.ok) {
            document.getElementById('productSearch').value = '';
            document.getElementById('priceInput').value = '';
            selectedProductId = null;
            updateInvoiceUI();
        }
    } catch (err) { console.error("System Error", err); }
}

// 3. Update Invoice UI - Matches @RequestMapping("/api/bills") + @GetMapping("/{bill_id}")
async function updateInvoiceUI() {
    const res = await fetch(`http://localhost:8080/api/bills/${currentBillId}`);
    const bill = await res.json();
    
    document.getElementById('invoice').style.display = 'block';
    document.getElementById('dispId').innerText = bill.id;
    document.getElementById('dispDate').innerText = bill.date;

    const tbody = document.querySelector('#billTable tbody');
    tbody.innerHTML = '';
    let total = 0;

    if (bill.billItems) {
        bill.billItems.forEach(item => {
            const pName = item.product ? item.product.name : "Item";
            
            // Naya Row Structure: Name ke saath Delete button aur Price par Edit click
            tbody.innerHTML += `
                <tr>
                    <td class="product-name-cell">
                        ${pName}
                        <span class="delete-icon" onclick="deleteLineItem(${item.id})">✖</span>
                    </td>
                    <td class="price-cell" onclick="makePriceEditable(this, ${item.id})">
                        ${item.price}
                    </td>
                </tr>`;
            total += item.price;
        });
    }
    document.getElementById('totalAmt').innerText = total;
}
// Function jo Modal ko dikhaye ga
function saveAndNewBill() {

    if (!currentBillId) {
        // Purana alert khatam, ab custom modal aayega
        showModal("Khali Bill!", "Pehle kuch products add karein phir save hoga.", false);
        return;
    }

    // Confirmation ke liye
    showModal("Save Bill", "Kya aap waqayi naya bill shuru karna chahte hain?", true, async () => {
        await executeNewBill();
    });
    // if (!currentBillId) return alert("Pehle products add karke bill to banayein!");

    const modal = document.getElementById('customModal');
    modal.style.display = 'flex'; // Modal dikhao

    // Jab user OK dawaye
    document.getElementById('confirmYes').onclick = async () => {
        modal.style.display = 'none'; // Modal chhupao
        await executeNewBill(); // Asli save logic
    };

    // Jab user Cancel dawaye
    document.getElementById('confirmNo').onclick = () => {
        modal.style.display = 'none';
    };
}

// Ye hai tumhari purani API logic
async function executeNewBill() {
    try {
        const bRes = await fetch('http://localhost:8080/api/bills/create', { method: 'POST' });
        const bData = await bRes.json();

        currentBillId = bData.id;
        selectedProductId = null;

        document.getElementById('productSearch').value = '';
        document.getElementById('priceInput').value = '';
        document.getElementById('searchResults').style.display = 'none';

        await updateInvoiceUI();
        // Browser alert ki jagah chaho to yahan b aik chota success message dikha saktay ho
    } catch (err) {
        console.error("Save Bill Error", err);
    }
}
function showModal(title, message, isConfirm = true, callback = null) {
    const modal = document.getElementById('customModal');
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalMessage').innerText = message;
    
    const yesBtn = document.getElementById('confirmYes');
    const noBtn = document.getElementById('confirmNo');

    // Agar sirf warning hai toh Cancel button chhupa do
    noBtn.style.display = isConfirm ? 'inline-block' : 'none';

    modal.style.display = 'flex';

    yesBtn.onclick = () => {
        modal.style.display = 'none';
        if (callback) callback();
    };

    noBtn.onclick = () => {
        modal.style.display = 'none';
    };
}
async function deleteLineItem(itemId) {
    // Console mein check karne ke liye ke click hua ya nahi
    console.log("Deleting item ID:", itemId);

    try {
        const response = await fetch(`http://localhost:8080/delete_item/${itemId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // Jab backend se item delete ho jaye, toh UI ko refresh karo
            // Ye poori row (Product + Price) hata dega aur Total update kar dega
            await updateInvoiceUI(); 
        } else {
            console.error("Server error: Delete failed");
        }
    } catch (error) {
        console.error("Network error: Delete failed", error);
    }
}
// function makePriceEditable(cell, itemId) {
//     const oldPrice = cell.innerText;
//     cell.innerHTML = `<input type="number" id="tempInput" value="${oldPrice}" style="width:60px;">`;
//     const input = document.getElementById("tempInput");
//     input.focus();

//     // Jab user enter dabaye ya bahar click kare
//     input.onblur = () => savePrice(cell, itemId, input.value, oldPrice);
//     input.onkeydown = (e) => {
//         if (e.key === "Enter") savePrice(cell, itemId, input.value, oldPrice);
//     };
// }

async function savePrice(cell, itemId, newPrice, oldPrice) {
    if (newPrice === oldPrice || !newPrice) {
        cell.innerText = oldPrice;
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/Update_item/${itemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parseFloat(newPrice))
        });

        if (response.ok) {
            fetchCurrentBill(currentBillId); // Bill refresh taake total update ho jaye
        } else {
            cell.innerText = oldPrice;
        }
    } catch (error) {
        cell.innerText = oldPrice;
    }
}
function makePriceEditable(cell, itemId) {
    
    const oldPrice = cell.innerText;
    // Input field create karna
    cell.innerHTML = `<input type="number" id="tempInput" value="${oldPrice}" style="width:70px;" min="1">`;
    const input = document.getElementById("tempInput");
    input.focus();


    // Ye line add karo:
    input.onclick = (e) => e.stopPropagation();
    // Keydown event handle karna (Enter key ke liye)
    input.onkeydown = async (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Default behavior roko
            const val = parseFloat(input.value);
            
            // Validation: Agar value 0 ya empty hai toh input band nahi hoga
            if (isNaN(val) || val <= 0) {
                input.style.border = "2px solid red";
                return; 
            }
            await savePrice(cell, itemId, val, oldPrice);
        }
    };

    // Agar user bahar click kare (Blur)
    input.onblur = async () => {
        const val = parseFloat(input.value);
        if (isNaN(val) || val <= 0) {
            cell.innerText = oldPrice; // Purani price wapis le aao agar galti hai
        } else {
            await savePrice(cell, itemId, val, oldPrice);
        }
    };
}

async function savePrice(cell, itemId, newPrice, oldPrice) {
    try {
        const response = await fetch(`http://localhost:8080/Update_item/${itemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPrice) // Direct number bhejo jaisa tumhare Controller ko chahiye
        });

        if (response.ok) {
            updateInvoiceUI(); // UI refresh taake total update ho jaye
        } else {
            cell.innerText = oldPrice;
            alert("Update failed on server");
        }
    } catch (error) {
        cell.innerText = oldPrice;
        console.error("Error updating price:", error);
    }
   // Send a pulse to the server every 5 seconds

}