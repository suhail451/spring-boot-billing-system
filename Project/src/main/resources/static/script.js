let currentBillId = null;
let selectedProductId = null;

// 1. Search Logic
async function searchProducts() {
    const val = document.getElementById('productSearch').value;
    const resDiv = document.getElementById('searchResults');

    if (val.length < 1) {
        resDiv.style.display = 'none';
        return;
    }

    try {
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

// 2. Add Button Logic - FIXED
async function addItem() {
    const priceValue = document.getElementById('priceInput').value;
    if (!selectedProductId || !priceValue) {
        showModal("Missing Info", "Meharbani karke product select karein aur qeemat darj karein.", false);
        return;
    }

    try {
        // STEP 1: Bill create karo agar nahi hai
        if (!currentBillId) {
            const bRes = await fetch('http://localhost:8080/api/bills/create', {
                method: 'POST'
            });
            if (!bRes.ok) {
                console.error("Bill create failed:", bRes.status);
                return;
            }
            const bData = await bRes.json();
            currentBillId = bData.id;
            console.log("Bill created with ID:", currentBillId);
        }

        // STEP 2: Item add karo
        const payload = {
            billId: currentBillId,
            productId: selectedProductId,
            price: parseFloat(priceValue)
        };

        console.log("Sending payload:", payload);

        const addRes = await fetch('http://localhost:8080/addItem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (addRes.ok) {
            document.getElementById('productSearch').value = '';
            document.getElementById('priceInput').value = '';
            selectedProductId = null;
            await updateInvoiceUI();
        } else {
            const err = await addRes.json();
            console.error("Add item failed:", err);
        }
    } catch (err) {
        console.error("System Error", err);
    }
}

// 3. Update Invoice UI - FIXED null check
async function updateInvoiceUI() {
    if (!currentBillId) return; // ← null check add kiya

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

// 4. Save & New Bill - FIXED duplicate logic hataya
function saveAndNewBill() {
    if (!currentBillId) {
        showModal("Khali Bill!", "Pehle kuch products add karein phir save hoga.", false);
        return;
    }
    // Sirf showModal — neeche wala duplicate block hataya
    showModal("Save Bill", "Kya aap waqayi naya bill shuru karna chahte hain?", true, async () => {
        await executeNewBill();
    });
}

// 5. Execute New Bill
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
    } catch (err) {
        console.error("Save Bill Error", err);
    }
}

// 6. Show Modal
function showModal(title, message, isConfirm = true, callback = null) {
    const modal = document.getElementById('customModal');
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalMessage').innerText = message;

    const yesBtn = document.getElementById('confirmYes');
    const noBtn = document.getElementById('confirmNo');

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

// 7. Delete Line Item
async function deleteLineItem(itemId) {
    console.log("Deleting item ID:", itemId);
    try {
        const response = await fetch(`http://localhost:8080/delete_item/${itemId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            await updateInvoiceUI();
        } else {
            console.error("Server error: Delete failed");
        }
    } catch (error) {
        console.error("Network error: Delete failed", error);
    }
}

// 8. Make Price Editable
function makePriceEditable(cell, itemId) {
    const oldPrice = cell.innerText;
    cell.innerHTML = `<input type="number" id="tempInput" value="${oldPrice}" style="width:70px;" min="1">`;
    const input = document.getElementById("tempInput");
    input.focus();

    input.onclick = (e) => e.stopPropagation();

    input.onkeydown = async (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const val = parseFloat(input.value);
            if (isNaN(val) || val <= 0) {
                input.style.border = "2px solid red";
                return;
            }
            await savePrice(cell, itemId, val, oldPrice);
        }
    };

    input.onblur = async () => {
        const val = parseFloat(input.value);
        if (isNaN(val) || val <= 0) {
            cell.innerText = oldPrice;
        } else {
            await savePrice(cell, itemId, val, oldPrice);
        }
    };
}

// 9. Save Price - FIXED single version only
async function savePrice(cell, itemId, newPrice, oldPrice) {
    try {
        const response = await fetch(`http://localhost:8080/Update_item/${itemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPrice)
        });

        if (response.ok) {
            await updateInvoiceUI(); // ← fetchCurrentBill ki jagah updateInvoiceUI
        } else {
            cell.innerText = oldPrice;
            alert("Update failed on server");
        }
    } catch (error) {
        cell.innerText = oldPrice;
        console.error("Error updating price:", error);
    }
}