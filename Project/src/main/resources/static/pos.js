// ============================================================
//  pos.js  —  POS Dashboard Frontend Logic
//  Sari fetch requests aur UI updates yahan hain
//  HTML (pos.html) se bilkul alag
// ============================================================

const BASE_URL = "http://localhost:8080";

// ─────────────────────────────────────────
// 1. LIVE CLOCK — Har second update hoti hai
// ─────────────────────────────────────────
function startClock() {
    function tick() {
        document.getElementById("liveClock").innerText =
            new Date().toLocaleTimeString('en-PK');
    }
    setInterval(tick, 1000);
    tick(); // Pehli baar foran dikhao
}

// ─────────────────────────────────────────
// 2. TODAY'S DATE — Page load hote hi set ho
// ─────────────────────────────────────────
function setTodayDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById("todayDate").innerText =
        new Date().toLocaleDateString('en-PK', options);
}

// ─────────────────────────────────────────
// 3. CONFIG — Har button ka endpoint aur UI info
//    Ek jagah se sab control hota hai
// ─────────────────────────────────────────
const now = new Date();

const SALES_CONFIG = {
    today: {
        url:         BASE_URL + "/api/bills/today-sales",
        cardId:      "card-today",
        headerCls:   "rh-today",
        titleCls:    "rt-green",
        titleText:   "Aaj Ki Total Sale",
        periodBadge: now.toLocaleDateString('en-PK', { weekday: 'short', day: 'numeric', month: 'short' }),
        metaPeriod:  "Today Only",
        btnSelector: ".btn-today"
    },
    week: {
        url:         BASE_URL + "/api/bills/Weekly-sales",
        cardId:      "card-week",
        headerCls:   "rh-week",
        titleCls:    "rt-blue",
        titleText:   "Weekly Total Sale",
        periodBadge: "Pichle 7 Din",
        metaPeriod:  "Last 7 Days",
        btnSelector: ".btn-week"
    },
    month: {
        url:         BASE_URL + "/api/bills/Monthly-sales",
        cardId:      "card-month",
        headerCls:   "rh-month",
        titleCls:    "rt-purple",
        titleText:   "Monthly Total Sale",
        periodBadge: now.toLocaleDateString('en-PK', { month: 'long', year: 'numeric' }),
        metaPeriod:  "Current Month",
        btnSelector: ".btn-month"
    }
};

// ─────────────────────────────────────────
// 4. HELPER — Number ko Rs format mein convert karo
//    e.g. 5250 → "5,250.00"
// ─────────────────────────────────────────
function formatAmount(n) {
    return n.toLocaleString('en-PK', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// ─────────────────────────────────────────
// 5. UI UPDATE — Result box ko populate karo
// ─────────────────────────────────────────
function updateResultUI(config, total, timeStr) {
    // Summary card upar update karo
    document.getElementById(config.cardId).innerHTML =
        '<span class="rs">Rs. </span>' + formatAmount(total);

    // Result box header ka color/class change karo
    document.getElementById("resultHeader").className = "result-header " + config.headerCls;
    document.getElementById("resultTitle").className  = "result-title "  + config.titleCls;

    // Text values set karo
    document.getElementById("resultTitleText").innerText   = config.titleText;
    document.getElementById("resultPeriodBadge").innerText = config.periodBadge;
    document.getElementById("resultAmount").innerText      = formatAmount(total);
    document.getElementById("metaPeriod").innerText        = config.metaPeriod;
    document.getElementById("metaTime").innerText          = timeStr;
    document.getElementById("lastUpdated").innerText       = timeStr;
}

// ─────────────────────────────────────────
// 6. MAIN FETCH FUNCTION — Button click pe chalta hai
//    HTML se: onclick="fetchSales('today')"
// ─────────────────────────────────────────
async function fetchSales(type) {
    const config      = SALES_CONFIG[type];
    const btn         = document.querySelector(config.btnSelector);
    const resultBox   = document.getElementById("resultSection");
    const zeroBanner  = document.getElementById("zeroBanner");

    // --- Loading state shuru ---
    btn.classList.add("loading");
    resultBox.classList.remove("visible");
    zeroBanner.classList.remove("show");

    try {
        // Backend se request karo
        const response = await fetch(config.url);

        if (!response.ok) {
            throw new Error("Server ne error diya: HTTP " + response.status);
        }

        // Response se number nikalo
        const total   = await response.json();
        const timeStr = new Date().toLocaleTimeString('en-PK');

        // UI update karo
        updateResultUI(config, total, timeStr);

        // Result box dikhao
        resultBox.classList.add("visible");

        // Agar sale zero hai to warning dikhao
        if (total === 0) {
            zeroBanner.classList.add("show");
        }

    } catch (error) {
        console.error("fetchSales error:", error);
        alert(
            "Server se data nahi aaya!\n" +
            "Spring Boot chal raha hai?\n\n" +
            "Error: " + error.message
        );
    } finally {
        // Loading state khatam — chahe success ho ya fail
        btn.classList.remove("loading");
    }
}

// ─────────────────────────────────────────
// 7. INIT — Page load hote hi ye sab chale
// ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {
    startClock();
    setTodayDate();
});