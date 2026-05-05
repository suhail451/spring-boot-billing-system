<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title>Rashid Majid Kiryana Store | POS System</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="index.css">
</head>
<body>

<div class="portal-wrapper">
    <header class="shop-header">
        <h1 class="shop-title">Rashid Majid Kiryana Store</h1>
        <p class="shop-tagline">Yahan sab ko sab milta hay</p>
        <div class="system-status">
            <span class="status-dot"></span>
            <span class="status-text">System Online</span>
            <span class="status-sep">|</span>
            <span id="clock" class="live-clock">--:--:--</span>
        </div>
    </header>

    <main class="portal-content">
        <div class="stats-center">
            <div class="stat-card">
                <div class="stat-label"><i class="fas fa-receipt"></i> Today's Sales</div>
                <div class="stat-value" id="todaySales">Rs 0</div>
                <div class="stat-meta" id="billCount">0 bills today</div>
            </div>
            <div class="stat-card">
                <div class="stat-label"><i class="fas fa-clock"></i> Session Time</div>
                <div class="stat-value" id="sessionTime">00:00:00</div>
                <div class="stat-meta">Active Session</div>
            </div>
        </div>

        <div class="nav-grid">
            <a href="createBill.html" class="nav-card">
                <div class="card-icon-wrap"><i class="fas fa-file-invoice-dollar"></i></div>
                <h3 class="card-title">Create Bill</h3>
                <p class="card-desc">Process new sales and print receipts.</p>
            </a>

            <a href="inventry.html" class="nav-card">
                <div class="card-icon-wrap"><i class="fas fa-boxes"></i></div>
                <h3 class="card-title">Inventory</h3>
                <p class="card-desc">Manage stock levels and pricing.</p>
            </a>

            <a href="orderHistory.html" class="nav-card">
                <div class="card-icon-wrap"><i class="fas fa-history"></i></div>
                <h3 class="card-title">Order History</h3>
                <p class="card-desc">Review logs and transactions.</p>
            </a>
        </div>

        <div class="portal-footer">
            <button class="logout-btn" onclick="handleLogout(event)">
                <i class="fas fa-power-off"></i> Exit System
            </button>
        </div>
    </main>
</div>

<script>
    (function() {
        // ========== PERSISTENT SESSION TIME ==========
        const SESSION_STORAGE_KEY = 'pos_session_start_time';
        
        function getSessionStartTime() {
            let sessionStart = localStorage.getItem(SESSION_STORAGE_KEY);
            if (!sessionStart) {
                sessionStart = Date.now();
                localStorage.setItem(SESSION_STORAGE_KEY, sessionStart);
            }
            return parseInt(sessionStart);
        }
        
        function updateSessionTime() {
            const sessionStart = getSessionStartTime();
            const elapsedSeconds = Math.floor((Date.now() - sessionStart) / 1000);
            const hours = String(Math.floor(elapsedSeconds / 3600)).padStart(2, '0');
            const mins = String(Math.floor((elapsedSeconds % 3600) / 60)).padStart(2, '0');
            const secs = String(elapsedSeconds % 60).padStart(2, '0');
            const sessionElem = document.getElementById('sessionTime');
            if (sessionElem) sessionElem.textContent = `${hours}:${mins}:${secs}`;
        }
        
        // ========== BACKEND API CONFIGURATION ==========
        const BASE_URL = "http://localhost:8080";
        
        // Helper: Calculate bill total from billItems (same as orderHistory.js)
        function calculateBillTotal(bill) {
            if (!bill.billItems || bill.billItems.length === 0) return 0;
            return bill.billItems.reduce((sum, item) => sum + (item.price || 0), 0);
        }
        
        // ========== FETCH TODAY'S BILLS FROM BACKEND (USING SAME API AS ORDER HISTORY) ==========
        async function fetchTodayBills() {
            try {
                // Get today's date in YYYY-MM-DD format
                const today = new Date().toISOString().split('T')[0];
                const response = await fetch(`${BASE_URL}/api/bills/BillByDate?date=${today}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                
                const bills = await response.json();
                return bills;
            } catch (error) {
                console.error("Failed to fetch today's bills:", error);
                return [];
            }
        }
        
        // ========== UPDATE UI WITH BACKEND DATA ==========
        async function updateStatsUI() {
            try {
                const bills = await fetchTodayBills();
                
                // Calculate total sales from bills (sum of all bill totals)
                let totalSales = 0;
                for (const bill of bills) {
                    totalSales += calculateBillTotal(bill);
                }
                
                const billCount = bills.length;
                
                const salesElem = document.getElementById('todaySales');
                const billCountElem = document.getElementById('billCount');
                
                if (salesElem) {
                    const formattedTotal = totalSales.toLocaleString('en-PK', { 
                        minimumFractionDigits: 0, 
                        maximumFractionDigits: 0 
                    });
                    salesElem.textContent = `Rs ${formattedTotal}`;
                }
                
                if (billCountElem) {
                    billCountElem.textContent = `${billCount} bills today`;
                }
                
                console.log(`✅ Today: ${billCount} bills, Total Sales: Rs ${totalSales}`);
                
            } catch (error) {
                console.error("Failed to update stats:", error);
                const salesElem = document.getElementById('todaySales');
                const billCountElem = document.getElementById('billCount');
                if (salesElem) salesElem.textContent = 'Rs 0';
                if (billCountElem) billCountElem.textContent = '0 bills today';
            }
        }
        
        // ========== AUTO-REFRESH EVERY 30 SECONDS ==========
        let refreshInterval = setInterval(() => {
            updateStatsUI();
        }, 30000);
        
        window.addEventListener('beforeunload', () => {
            if (refreshInterval) clearInterval(refreshInterval);
        });
        
        // ========== LIVE CLOCK ==========
        function updateLiveClock() {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-PK', { hour12: false });
            const clockSpan = document.getElementById('clock');
            if (clockSpan) clockSpan.textContent = timeStr;
        }
        updateLiveClock();
        setInterval(updateLiveClock, 1000);
        
        // ========== SESSION TIMER ==========
        updateSessionTime();
        setInterval(updateSessionTime, 1000);
        
        // ========== LOGOUT ==========
        window.handleLogout = function(e) {
            if (confirm('Are you sure you want to exit the POS system? Session will be closed.')) {
                localStorage.removeItem(SESSION_STORAGE_KEY);
                window.location.href = 'login.html';
            }
        };
        
        // ========== INITIAL LOAD ==========
        updateStatsUI();
        
        console.log("✅ Home page now using same API as orderHistory.js - /api/bills/BillByDate");
    })();
</script>
</body>
</html>