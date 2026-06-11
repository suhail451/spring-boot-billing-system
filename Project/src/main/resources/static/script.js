let currentBillId = null;
let selectedProductId = null;

// 1. Search Logic
async function searchProducts() {
    const val = document.getElementById('productSearch').value;
    const resDiv = document.getElementById('searchResults');

    if (val.length < 1) {
        resDiv.innerHTML = '';
        resDiv.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/search/${val}`);
        const products = await response.json();

        resDiv.innerHTML = '';

        if (products.length === 0) {
            resDiv.style.display = 'none';
            return;
        }

        products.forEach(p => {
            const d = document.createElement('div');
            d.innerText = p.name;
            d.onclick = () => selectProduct(p.id, p.name);
            resDiv.appendChild(d);
        });

        resDiv.style.display = 'block';
    } catch (e) {
        console.error("Search Error", e);
        resDiv.style.display = 'none';
    }
}

function selectProduct(id, name) {
    selectedProductId = id;
    document.getElementById('productSearch').value = name;
    document.getElementById('searchResults').innerHTML = '';
    document.getElementById('searchResults').style.display = 'none';
    clearPriceError();
    document.getElementById('priceInput').focus();
}

// 2. Add Button Logic
async function addItem() {
    const priceValue = document.getElementById('priceInput').value;
    const price = parseFloat(priceValue);

    // Frontend validation — catch before even hitting the server
    if (!selectedProductId) {
        showPriceError("Pehle koi product select karein.");
        return;
    }
    if (!priceValue || isNaN(price)) {
        showPriceError("Qeemat darj karein.");
        return;
    }
    if (price <= 0) {
        showPriceError("Qeemat 0 ya usse kam nahi ho sakti. Sahi qeemat likhein.");
        return;
    }

    // Clear any previous error
    clearPriceError();

    try {
        // currentBillId is null after save, so a fresh bill gets created
        if (!currentBillId) {
            const bRes = await fetch('http://localhost:8080/api/bills/create', { method: 'POST' });
            const bData = await bRes.json();
            currentBillId = bData.id;
            console.log("New bill created:", currentBillId);
        }

        const payload = {
            billId: currentBillId,
            productId: selectedProductId,
            price: price
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
            document.getElementById('searchResults').style.display = 'none';
            clearPriceError();
            await updateInvoiceUI();
        } else {
            // Backend ne error diya — readable message dikhao
            let msg = "Kuch masla hua, dobara koshish karein.";
            try {
                const errData = await addRes.json();
                if (errData && errData.message) msg = errData.message;
            } catch (_) { /* backend ne JSON nahi diya, default message use karo */ }
            showPriceError(msg);
        }
    } catch (err) {
        console.error("System Error", err);
        showPriceError("Server se connection nahi ho pa raha.");
    }
}

// Helper: price input ke neeche red error dikhao
function showPriceError(message) {
    let errEl = document.getElementById('priceErrorMsg');
    if (!errEl) {
        errEl = document.createElement('div');
        errEl.id = 'priceErrorMsg';
        errEl.style.cssText = `
            color: #e74c3c;
            font-size: 0.82rem;
            margin-top: 5px;
            padding: 6px 10px;
            background: #fdecea;
            border: 1px solid #f5c6cb;
            border-radius: 6px;
            display: inline-block;
        `;
        // Price input ke baad insert karo
        const priceInput = document.getElementById('priceInput');
        priceInput.parentNode.insertBefore(errEl, priceInput.nextSibling);
    }
    errEl.textContent = '⚠ ' + message;
    errEl.style.display = 'inline-block';

    // Price input ko highlight karo
    document.getElementById('priceInput').style.border = '1.5px solid #e74c3c';
}

// Helper: error clear karo
function clearPriceError() {
    const errEl = document.getElementById('priceErrorMsg');
    if (errEl) errEl.style.display = 'none';
    const priceInput = document.getElementById('priceInput');
    if (priceInput) priceInput.style.border = '1px solid #ddd';
}

// 3. Update Invoice UI
async function updateInvoiceUI() {
    if (!currentBillId) return;

    try {
        const res = await fetch(`http://localhost:8080/api/bills/${currentBillId}`);
        const bill = await res.json();

        document.getElementById('invoice').style.display = 'block';
        document.getElementById('dispId').innerText = '#' + bill.id;
        document.getElementById('dispDate').innerText = bill.date;
        document.getElementById('dispTime').innerText = new Date().toLocaleTimeString('en-PK', { hour12: false });

        const tbody = document.querySelector('#billTable tbody');
        tbody.innerHTML = '';
        let total = 0;

        if (bill.billItems && bill.billItems.length > 0) {
            bill.billItems.forEach(item => {
                const pName = item.product ? item.product.name : "Item";
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="col-product">${pName}</td>
                    <td class="col-price">${item.price}</td>
                    <td class="col-action">
                        <button class="delete-btn" onclick="deleteLineItem(${item.id})">✕</button>
                    </td>
                `;
                tbody.appendChild(tr);
                total += item.price;
            });
        }

        document.getElementById('totalAmt').innerText = total;

        // Auto-scroll to bottom so newest item is always visible
        const invoiceBox = document.getElementById('invoice');
        requestAnimationFrame(() => {
            invoiceBox.scrollTop = invoiceBox.scrollHeight;
        });

    } catch (err) {
        console.error("UI Update Error", err);
    }
}

// 4. confirmSave - resets state so next addItem() starts a fresh bill
async function confirmSave() {
    if (!currentBillId) return;

    // CRITICAL: reset bill state so next product starts a new bill
    currentBillId = null;
    selectedProductId = null;

    // Reset all UI
    document.getElementById('invoice').style.display = 'none';
    document.querySelector('#billTable tbody').innerHTML = '';
    document.getElementById('totalAmt').innerText = '0';
    document.getElementById('dispId').innerText = '#000';
    document.getElementById('dispDate').innerText = '--/--/--';
    document.getElementById('dispTime').innerText = '--:--';
    document.getElementById('productSearch').value = '';
    document.getElementById('priceInput').value = '';
    document.getElementById('searchResults').innerHTML = '';
    document.getElementById('searchResults').style.display = 'none';

    closeModal();
    showToast('✓ Bill save ho gaya!');
}

// 5. openSaveModal - only opens if there is an active bill
function openSaveModal() {
    if (!currentBillId) {
        alert('Pehle kuch products add karein phir save hoga.');
        return;
    }
    document.getElementById('saveModal').style.display = 'flex';
}

// 6. closeModal
function closeModal() {
    document.getElementById('saveModal').style.display = 'none';
}

// 7. Delete Line Item
async function deleteLineItem(itemId) {
    try {
        const response = await fetch(`http://localhost:8080/delete_item/${itemId}`, { method: 'DELETE' });
        if (response.ok) await updateInvoiceUI();
    } catch (error) {
        console.error("Delete Error", error);
    }
}

// 8. Toast notification
function showToast(msg) {
    const existing = document.querySelector('.toast-msg');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = msg;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// 9. Close search dropdown when clicking outside
document.addEventListener('click', function (e) {
    const search = document.getElementById('productSearch');
    const results = document.getElementById('searchResults');
    if (search && results && !search.contains(e.target) && !results.contains(e.target)) {
        results.style.display = 'none';
    }
});

// 10. Clear price error as soon as user starts correcting the value
document.addEventListener('DOMContentLoaded', function () {
    const priceInput = document.getElementById('priceInput');
    if (priceInput) {
        priceInput.addEventListener('input', clearPriceError);
    }
});
