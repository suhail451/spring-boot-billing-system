const BASE_URL = "http://localhost:8080";

// ── Live Clock ──────────────────────────────────────────────
function updateClock() {
    const now = new Date();
    document.getElementById("liveClock").textContent =
        now.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
setInterval(updateClock, 1000);
updateClock();

// ── Hide all result states ───────────────────────────────────
function hideAllStates() {
    document.getElementById("hintState").style.display = "none";
    document.getElementById("resultsArea").classList.remove("show");
    document.getElementById("emptyState").classList.remove("show");
    document.getElementById("errorState").classList.remove("show");
    document.getElementById("statsBar").classList.remove("show");
}

// ── Main Search Function ─────────────────────────────────────
async function searchBillsByDate() {
    const dateInput = document.getElementById("dateInput");
    const date = dateInput.value;

    if (!date) {
        dateInput.focus();
        return;
    }

    const btn = document.getElementById("searchBtn");
    btn.classList.add("loading");
    hideAllStates();

    try {
        const response = await fetch(`${BASE_URL}/api/bills/BillByDate?date=${date}`);

        if (!response.ok) throw new Error("Server error: " + response.status);

        const bills = await response.json();

        if (!bills || bills.length === 0) {
            document.getElementById("emptyState").classList.add("show");
            return;
        }

        renderStats(bills);
        renderBills(bills, date);

    } catch (err) {
        console.error("Order history fetch error:", err);
        document.getElementById("errorState").classList.add("show");
    } finally {
        btn.classList.remove("loading");
    }
}

// ── Render Stats Bar ─────────────────────────────────────────
function renderStats(bills) {
    let totalItems = 0;
    let totalRevenue = 0;

    bills.forEach(bill => {
        if (bill.billItems) {
            totalItems += bill.billItems.length;
            totalRevenue += bill.billItems.reduce((sum, i) => sum + i.price, 0);
        }
    });

    document.getElementById("statBills").textContent   = bills.length;
    document.getElementById("statItems").textContent   = totalItems;
    document.getElementById("statRevenue").textContent = "Rs. " + totalRevenue.toLocaleString("en-PK");

    document.getElementById("statsBar").classList.add("show");
}

// ── Render Bill Cards ────────────────────────────────────────
function renderBills(bills, date) {
    const list = document.getElementById("billsList");
    list.innerHTML = "";

    const formatted = new Date(date).toLocaleDateString("en-PK", {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
    });
    document.getElementById("resultsTitle").textContent     = `${bills.length} Bill(s) Found`;
    document.getElementById("resultsDateBadge").textContent = formatted;

    bills.forEach(bill => {
        const total = bill.billItems
            ? bill.billItems.reduce((s, i) => s + i.price, 0)
            : 0;

        const itemRows = bill.billItems && bill.billItems.length > 0
            ? bill.billItems.map((item, idx) => `
                <tr>
                    <td style="width:60px;padding-left:24px;color:var(--text-muted);font-size:0.82rem;">${idx + 1}</td>
                    <td>
                        <div class="product-name-cell">
                            <div class="product-dot"></div>
                            ${item.product ? item.product.name : "Unknown Product"}
                        </div>
                    </td>
                    <td>Rs. ${item.price.toLocaleString("en-PK")}</td>
                </tr>`).join("")
            : `<tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:20px;">
                Is bill mein koi item nahi hai
               </td></tr>`;

        const card = document.createElement("div");
        card.className = "bill-card";
        card.innerHTML = `
            <div class="bill-card-header" onclick="toggleCard(this)">
                <div class="bill-id-wrap">
                    <span class="bill-id-badge">#${bill.id}</span>
                    <div>
                        <div class="bill-id-label">Bill #${bill.id}</div>
                        <div class="bill-id-sub">${bill.billItems ? bill.billItems.length : 0} item(s)</div>
                    </div>
                </div>
                <div class="bill-header-right">
                    <div class="bill-total-badge">
                        <span class="rs">Rs.</span>${total.toLocaleString("en-PK")}
                    </div>
                    <i class="fas fa-chevron-down toggle-icon"></i>
                </div>
            </div>
            <div class="bill-items-wrap">
                <table class="bill-items-table">
                    <thead>
                        <tr>
                            <th style="width:60px;">#</th>
                            <th>Product</th>
                            <th style="text-align:right;">Price</th>
                        </tr>
                    </thead>
                    <tbody>${itemRows}</tbody>
                </table>
                <div class="bill-items-footer">
                    <span class="footer-label">Total:</span>
                    <span class="footer-total"><span class="rs">Rs. </span>${total.toLocaleString("en-PK")}</span>
                </div>
            </div>`;

        list.appendChild(card);
    });

    document.getElementById("resultsArea").classList.add("show");
}

// ── Expand / Collapse Card ───────────────────────────────────
function toggleCard(header) {
    header.parentElement.classList.toggle("expanded");
}

// ── On Page Load ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("dateInput").addEventListener("keydown", e => {
        if (e.key === "Enter") searchBillsByDate();
    });

    // Default to today's date
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("dateInput").value = today;
});
