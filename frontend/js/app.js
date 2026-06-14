// Dynamic API URL detection: uses localhost in development, or the production URL once deployed
const API = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000/api"
    : "https://backend-vert-eta-32.vercel.app/api";

// Helper: Get local storage items
const getUserId = () => localStorage.getItem("userId");
const getUserName = () => localStorage.getItem("userName");

// ----------------- SESSION & ROUTING CHECK -----------------
function checkSession() {
    const userId = getUserId();
    const path = window.location.pathname.toLowerCase();
    const isAuthPage = path.includes("login.html") || path.includes("register.html");

    if (!userId && !isAuthPage) {
        // Redirect to login if not authenticated
        window.location.href = "login.html";
    } else if (userId && isAuthPage) {
        // Redirect to dashboard if already authenticated
        window.location.href = "dashboard.html";
    }
}

// Run session check immediately
checkSession();

// ----------------- DOM CONTENT LOADED -----------------
document.addEventListener("DOMContentLoaded", () => {
    // Setup Logout Button
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = "login.html";
        });
    }

    // Set Welcome Name in Header
    const welcomeNameEl = document.getElementById("welcomeName");
    if (welcomeNameEl && getUserName()) {
        welcomeNameEl.innerText = getUserName();
    }

    // Initialise pages
    initLoginForm();
    initRegisterForm();
    initDashboard();
    initFarmsPage();
    initRecommendationPage();
    initHistoryPage();
    initFertilizersPage();
});

// ----------------- LOGIN FORM -----------------
function initLoginForm() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try {
            const res = await fetch(`${API}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("userId", data.user._id);
            localStorage.setItem("userName", data.user.name);
            window.location.href = "dashboard.html";
        } catch (err) {
            alert("Error: " + err.message);
        }
    });
}

// ----------------- REGISTER FORM -----------------
function initRegisterForm() {
    const form = document.getElementById("registerForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const language = document.getElementById("language").value;

        try {
            const res = await fetch(`${API}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, language })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Registration failed");
            }

            alert("Registered successfully! Please login.");
            window.location.href = "login.html";
        } catch (err) {
            alert("Error: " + err.message);
        }
    });
}

// ----------------- FARMER DASHBOARD -----------------
async function initDashboard() {
    const welcomeEl = document.getElementById("welcomeName");
    if (!welcomeEl) return;

    const userId = getUserId();
    
    try {
        // Fetch dashboard statistics
        const statsRes = await fetch(`${API}/recommendation/dashboard?userId=${userId}`);
        const statsData = await statsRes.json();

        // Fetch farms to display local farm count
        const farmsRes = await fetch(`${API}/farm?userId=${userId}`);
        const farmsData = await farmsRes.json();

        if (statsRes.ok && farmsRes.ok) {
            document.getElementById("statFarms").innerText = farmsData.length || 0;
            document.getElementById("statRecommendations").innerText = statsData.totalRecommendations || 0;
            
            const recent = statsData.recentRecommendations || [];
            if (recent.length > 0) {
                document.getElementById("statLatestCrop").innerText = recent[0].recommendedCrop;
                renderRecentRecommendations(recent);
            } else {
                document.getElementById("statLatestCrop").innerText = "None Yet";
                document.getElementById("recentRecommendationsList").innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">🌾</div>
                        <p>No recommendations generated yet. Head over to <b>My Farms</b> to run your first check!</p>
                    </div>
                `;
            }
        }
    } catch (err) {
        console.error("Dashboard error:", err);
    }
}

function renderRecentRecommendations(list) {
    const container = document.getElementById("recentRecommendationsList");
    if (!container) return;

    container.innerHTML = list.map(item => {
        const farmName = item.farmId ? item.farmId.farmName : "Deleted Farm Plot";
        const farmLocation = item.farmId ? item.farmId.location : "Unknown Location";
        const date = new Date(item.createdAt).toLocaleDateString(undefined, {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        return `
            <div class="history-card">
                <div class="history-info">
                    <h4>${farmName}</h4>
                    <p>${farmLocation} • ${date}</p>
                    <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
                        Weather: <b>${item.weatherCondition || 'Normal'}</b>
                    </p>
                </div>
                <div style="text-align: right; display: flex; flex-direction: column; gap: 4px;">
                    <span class="history-badge">🌾 ${item.recommendedCrop}</span>
                    <span class="history-badge" style="background: #fff8eb; color: var(--accent);">🧪 ${item.fertilizer}</span>
                    <span class="history-badge" style="background: #e0f2fe; color: #0284c7;">💧 ${item.waterRequirement || 'Medium'}</span>
                </div>
            </div>
        `;
    }).join("");
}

// ----------------- MY FARMS PAGE -----------------
function initFarmsPage() {
    const listContainer = document.getElementById("farmsList");
    if (!listContainer) return;

    const modal = document.getElementById("addFarmModal");
    const openBtn = document.getElementById("openAddFarmModalBtn");
    const closeBtn = document.getElementById("closeAddFarmModalBtn");
    const form = document.getElementById("addFarmForm");

    // Modal Events
    if (openBtn) openBtn.onclick = () => modal.style.display = "flex";
    if (closeBtn) closeBtn.onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

    // Load Farms List
    loadFarms();

    // Register Farm Plot
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const farmName = document.getElementById("farmName").value.trim();
            const location = document.getElementById("farmLocation").value.trim();
            const soilPH = parseFloat(document.getElementById("soilPH").value);
            const nitrogen = parseInt(document.getElementById("nitrogen").value);
            const phosphorus = parseInt(document.getElementById("phosphorus").value);
            const potassium = parseInt(document.getElementById("potassium").value);
            const userId = getUserId();

            try {
                const res = await fetch(`${API}/farm`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId, farmName, location, soilPH, nitrogen, phosphorus, potassium
                    })
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed to add farm");

                modal.style.display = "none";
                form.reset();
                loadFarms();
            } catch (err) {
                alert("Error: " + err.message);
            }
        });
    }
}

async function loadFarms() {
    const container = document.getElementById("farmsList");
    if (!container) return;

    const userId = getUserId();

    try {
        const res = await fetch(`${API}/farm?userId=${userId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        if (data.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-state-icon">🚜</div>
                    <p>No farms registered yet. Click the button above to add your first farm plot!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = data.map(farm => `
            <div class="farm-card">
                <div class="farm-card-header">
                    <h3>${farm.farmName}</h3>
                    <p>📍 ${farm.location}</p>
                </div>
                <div class="farm-card-body">
                    <div class="metrics-grid">
                        <div class="metric-item">
                            <div class="metric-label">Soil pH</div>
                            <div class="metric-value">${farm.soilPH}</div>
                        </div>
                        <div class="metric-item">
                            <div class="metric-label">Nitrogen (N)</div>
                            <div class="metric-value">${farm.nitrogen}</div>
                        </div>
                        <div class="metric-item">
                            <div class="metric-label">Phosphorus (P)</div>
                            <div class="metric-value">${farm.phosphorus}</div>
                        </div>
                        <div class="metric-item">
                            <div class="metric-label">Potassium (K)</div>
                            <div class="metric-value">${farm.potassium}</div>
                        </div>
                    </div>
                    <div class="farm-actions">
                        <button class="btn" onclick="analyzeFarm('${farm._id}', '${farm.farmName}', '${farm.location}', ${farm.soilPH}, ${farm.nitrogen}, ${farm.phosphorus}, ${farm.potassium})">
                            🔬 Analyze Soil
                        </button>
                        <button class="btn btn-danger" style="width: auto; padding: 12px 16px;" onclick="deleteFarm('${farm._id}')" title="Delete Plot">
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        `).join("");
    } catch (err) {
        container.innerHTML = `<p class="text-center" style="color: var(--danger)">Error loading farms: ${err.message}</p>`;
    }
}

// Global hook: Analyze Farm Soil
async function analyzeFarm(farmId, farmName, location, soilPH, nitrogen, phosphorus, potassium) {
    const userId = getUserId();
    try {
        const res = await fetch(`${API}/recommendation/crop`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId, farmId, soilPH, nitrogen, phosphorus, potassium
            })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Analysis request failed");

        // Save report data to localStorage and redirect
        const report = {
            farmName,
            location,
            crop: data.crop,
            fertilizer: data.fertilizer,
            waterRequirement: data.waterRequirement,
            soilPH,
            nitrogen,
            phosphorus,
            potassium
        };
        localStorage.setItem("latestRecommendation", JSON.stringify(report));
        window.location.href = "recommendation.html";
    } catch (err) {
        alert("Analysis Error: " + err.message);
    }
}
window.analyzeFarm = analyzeFarm;

// Global hook: Delete Farm Plot
async function deleteFarm(farmId) {
    if (!confirm("Are you sure you want to delete this farm plot? This will also remove references in the dashboard.")) return;

    try {
        const res = await fetch(`${API}/farm/${farmId}`, { method: "DELETE" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Delete failed");

        loadFarms();
    } catch (err) {
        alert("Delete Error: " + err.message);
    }
}
window.deleteFarm = deleteFarm;

// ----------------- RECOMMENDATION REPORT PAGE -----------------
function initRecommendationPage() {
    const checkEl = document.getElementById("recCrop");
    if (!checkEl) return;

    const reportStr = localStorage.getItem("latestRecommendation");
    if (!reportStr) {
        window.location.href = "dashboard.html";
        return;
    }

    const report = JSON.parse(reportStr);
    document.getElementById("recFarmName").innerText = report.farmName;
    document.getElementById("recFarmLocation").innerText = report.location;
    document.getElementById("recCrop").innerText = report.crop;
    document.getElementById("recFertilizer").innerText = report.fertilizer;
    if (document.getElementById("recWater")) {
        document.getElementById("recWater").innerText = report.waterRequirement || "Medium";
    }
    document.getElementById("recPH").innerText = report.soilPH;
    document.getElementById("recN").innerText = `${report.nitrogen} mg/kg`;
    document.getElementById("recP").innerText = `${report.phosphorus} mg/kg`;
    document.getElementById("recK").innerText = `${report.potassium} mg/kg`;
}

// ----------------- HISTORY PAGE -----------------
async function initHistoryPage() {
    const listContainer = document.getElementById("historyList");
    if (!listContainer) return;

    const userId = getUserId();

    try {
        const res = await fetch(`${API}/recommendation/history?userId=${userId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        if (data.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📂</div>
                    <p>No previous recommendation logs found. Head over to <b>My Farms</b> to analyze a plot!</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = data.map(item => {
            const farmName = item.farmId ? item.farmId.farmName : "Deleted Farm Plot";
            const farmLocation = item.farmId ? item.farmId.location : "Unknown Location";
            const date = new Date(item.createdAt).toLocaleDateString(undefined, {
                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            return `
                <div class="history-card">
                    <div class="history-info">
                        <h4 style="font-size: 20px; color: var(--primary-hover);">${farmName}</h4>
                        <p style="color: var(--text-secondary); font-size: 14px; margin-top: 2px;">📍 ${farmLocation} • 📅 ${date}</p>
                        
                        <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
                            <span style="font-size: 12px; background: #f1f5f9; padding: 4px 8px; border-radius: 6px;">pH: <b>${item.farmId ? item.farmId.soilPH : 'N/A'}</b></span>
                            <span style="font-size: 12px; background: #f1f5f9; padding: 4px 8px; border-radius: 6px;">N: <b>${item.farmId ? item.farmId.nitrogen : 'N/A'}</b></span>
                            <span style="font-size: 12px; background: #f1f5f9; padding: 4px 8px; border-radius: 6px;">P: <b>${item.farmId ? item.farmId.phosphorus : 'N/A'}</b></span>
                            <span style="font-size: 12px; background: #f1f5f9; padding: 4px 8px; border-radius: 6px;">K: <b>${item.farmId ? item.farmId.potassium : 'N/A'}</b></span>
                        </div>
                    </div>
                    <div style="text-align: right; display: flex; flex-direction: column; gap: 6px; min-width: 140px;">
                        <span class="history-badge">🌾 Crop: ${item.recommendedCrop}</span>
                        <span class="history-badge" style="background: #fff8eb; color: var(--accent);">🧪 Fert: ${item.fertilizer}</span>
                        <span class="history-badge" style="background: #e0f2fe; color: #0284c7;">💧 Water: ${item.waterRequirement || 'Medium'}</span>
                    </div>
                </div>
            `;
        }).join("");
    } catch (err) {
        listContainer.innerHTML = `<p class="text-center" style="color: var(--danger)">Error loading history: ${err.message}</p>`;
    }
}

// ----------------- FERTILIZER REFERENCE GUIDE PAGE -----------------
function initFertilizersPage() {
    const searchInput = document.getElementById("guideSearch");
    const tbody = document.getElementById("guideTableBody");
    if (!tbody || !searchInput) return;

    const modal = document.getElementById("addCropModal");
    const openBtn = document.getElementById("openAddCropModalBtn");
    const closeBtn = document.getElementById("closeAddCropModalBtn");
    const form = document.getElementById("addCropForm");

    // Modal Display Controls
    if (openBtn) openBtn.onclick = () => modal.style.display = "flex";
    if (closeBtn) closeBtn.onclick = () => modal.style.display = "none";
    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

    // Helper: Render table rows
    function renderRows(data, hasQuery) {
        if (!hasQuery) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="color: var(--text-secondary); padding: 40px 20px;">🔍 Enter a crop name in the search bar above to see its fertilizer guide.</td></tr>`;
            return;
        }
        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="color: var(--text-secondary); padding: 40px 20px;">No matching crops found. Try searching for something else.</td></tr>`;
            return;
        }
        tbody.innerHTML = data.map(item => `
            <tr>
                <td style="font-weight: 600; color: var(--primary-hover);">${item.name}</td>
                <td><span class="category-badge">${item.category}</span></td>
                <td><span class="category-badge" style="background: #e0f2fe; color: #0369a1;">💧 ${item.waterRequirement || 'Medium'}</span></td>
                <td style="font-weight: 500;">🧪 ${item.fertilizer}</td>
                <td><b style="color: var(--accent);">${item.npk}</b></td>
            </tr>
        `).join("");
    }

    // Dynamic Live Search from MongoDB Backend
    let debounceTimer;
    searchInput.addEventListener("input", (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.toLowerCase().trim();

        if (query === "") {
            renderRows([], false);
            return;
        }

        // Debounce API calls to optimize network requests
        debounceTimer = setTimeout(async () => {
            try {
                const res = await fetch(`${API}/fertilizer-guide?query=${encodeURIComponent(query)}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                renderRows(data, true);
            } catch (err) {
                console.error("Guide search error:", err);
                tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="color: var(--danger); padding: 40px 20px;">⚠️ Error loading guide data.</td></tr>`;
            }
        }, 250);
    });

    // Form Submission: Store Custom Crop in MongoDB
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("cropName").value.trim();
            const category = document.getElementById("cropCategory").value;
            const waterRequirement = document.getElementById("cropWater").value;
            const fertilizer = document.getElementById("cropFertilizer").value.trim();
            const npk = document.getElementById("cropNpk").value.trim();

            try {
                const res = await fetch(`${API}/fertilizer-guide`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, category, fertilizer, npk, waterRequirement })
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed to add crop guide");

                alert("Crop guide successfully saved to MongoDB!");
                modal.style.display = "none";
                form.reset();

                // Set search field to newly created crop and fetch it
                searchInput.value = name;
                const searchRes = await fetch(`${API}/fertilizer-guide?query=${encodeURIComponent(name)}`);
                const searchData = await searchRes.json();
                if (searchRes.ok) {
                    renderRows(searchData, true);
                }
            } catch (err) {
                alert("Error: " + err.message);
            }
        });
    }
}

