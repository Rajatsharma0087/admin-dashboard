// ===== THEME =====
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

function loadTheme() {
    const theme = localStorage.getItem('adminTheme') || 'light';
    if (theme === 'dark') {
        body.classList.add('dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    localStorage.setItem('adminTheme', isDark ? 'dark' : 'light');
    themeToggle.innerHTML = isDark
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
    updateChartColors();
});

// ===== SIDEBAR =====
const sidebar = document.getElementById('sidebar');
const hamburger = document.getElementById('hamburger');
const sidebarClose = document.getElementById('sidebarClose');
const overlay = document.getElementById('overlay');

hamburger.addEventListener('click', () => {
    sidebar.classList.add('open');
    overlay.classList.add('show');
});

sidebarClose.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
}

// Nav active state
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        link.parentElement.classList.add('active');
        if (window.innerWidth < 1024) closeSidebar();
    });
});

// ===== STATS COUNTER ANIMATION =====
function animateCounter(element, target, prefix = '', suffix = '') {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        if (target > 1000) {
            element.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
        } else if (target < 10) {
            element.textContent = prefix + current.toFixed(1) + suffix + '%';
        } else {
            element.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
        }
    }, duration / steps);
}

function initCounters() {
    const counters = document.querySelectorAll('.stat-value');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const index = Array.from(counters).indexOf(counter);
        const prefixes = ['', '$', '', ''];
        animateCounter(counter, target, prefixes[index]);
    });
}

// ===== FAKE DATA =====
const orders = [
    { id: '#ORD-001', customer: 'Sarah Johnson', product: 'Pro Plan', amount: '$299', status: 'Completed' },
    { id: '#ORD-002', customer: 'Mike Chen', product: 'Basic Plan', amount: '$99', status: 'Pending' },
    { id: '#ORD-003', customer: 'Emily Davis', product: 'Enterprise', amount: '$999', status: 'Completed' },
    { id: '#ORD-004', customer: 'James Wilson', product: 'Pro Plan', amount: '$299', status: 'Processing' },
    { id: '#ORD-005', customer: 'Anna Brown', product: 'Basic Plan', amount: '$99', status: 'Cancelled' },
];

const products = [
    { name: 'Enterprise Plan', sales: 842, revenue: '$84,200', progress: 85 },
    { name: 'Pro Plan', sales: 621, revenue: '$62,100', progress: 65 },
    { name: 'Basic Plan', sales: 430, revenue: '$43,000', progress: 45 },
    { name: 'Starter Plan', sales: 215, revenue: '$21,500', progress: 25 },
];

const activities = [
    { icon: 'fa-user-plus', color: 'green', text: 'New user registered', sub: 'sarah@example.com', time: '2 min ago' },
    { icon: 'fa-bag-shopping', color: 'blue', text: 'New order received', sub: 'Order #ORD-006 — $299', time: '15 min ago' },
    { icon: 'fa-server', color: 'orange', text: 'Server backup completed', sub: 'All systems normal', time: '1 hour ago' },
    { icon: 'fa-shield', color: 'purple', text: 'Security scan completed', sub: 'No threats detected', time: '2 hours ago' },
    { icon: 'fa-chart-line', color: 'green', text: 'Monthly report generated', sub: 'Revenue up 8.2%', time: '3 hours ago' },
    { icon: 'fa-triangle-exclamation', color: 'red', text: 'High CPU usage detected', sub: 'Server load at 89%', time: '5 hours ago' },
];

// ===== RENDER ORDERS =====
function renderOrders() {
    const tbody = document.getElementById('ordersTable');
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td class="order-id">${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.product}</td>
            <td class="amount">${order.amount}</td>
            <td>
                <span class="status-badge status-${order.status.toLowerCase()}">
                    ${order.status}
                </span>
            </td>
        </tr>
    `).join('');
}

// ===== RENDER PRODUCTS =====
function renderProducts() {
    const list = document.getElementById('productsList');
    list.innerHTML = products.map(p => `
        <div class="product-item">
            <div class="product-info">
                <span class="product-name">${p.name}</span>
                <span class="product-sales">${p.sales} sales</span>
            </div>
            <div class="product-right">
                <span class="product-revenue">${p.revenue}</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${p.progress}%"></div>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== RENDER ACTIVITY =====
function renderActivity() {
    const list = document.getElementById('activityList');
    list.innerHTML = activities.map(a => `
        <div class="activity-item">
            <div class="activity-icon bg-${a.color}">
                <i class="fas ${a.icon}"></i>
            </div>
            <div class="activity-content">
                <p class="activity-text">${a.text}</p>
                <p class="activity-sub">${a.sub}</p>
            </div>
            <span class="activity-time">${a.time}</span>
        </div>
    `).join('');
}

// ===== CHARTS =====
let revenueChart, trafficChart;

const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
             'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    values: [4200, 5800, 4900, 7200, 6100, 8900,
             7600, 9200, 8100, 11200, 9800, 12400]
};

const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [1200, 1900, 1500, 2100, 1800, 2800, 2200]
};

function getChartColors() {
    const isDark = body.classList.contains('dark');
    return {
        gridColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
        textColor: isDark ? '#94a3b8' : '#64748b',
    };
}

function initRevenueChart(data = monthlyData) {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    const colors = getChartColors();

    if (revenueChart) revenueChart.destroy();

    revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Revenue ($)',
                data: data.values,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => ` $${ctx.raw.toLocaleString()}`
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: colors.gridColor },
                    ticks: { color: colors.textColor }
                },
                y: {
                    grid: { color: colors.gridColor },
                    ticks: {
                        color: colors.textColor,
                        callback: val => '$' + val.toLocaleString()
                    }
                }
            }
        }
    });
}

function initTrafficChart() {
    const ctx = document.getElementById('trafficChart').getContext('2d');

    if (trafficChart) trafficChart.destroy();

    trafficChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Organic', 'Social', 'Direct', 'Referral'],
            datasets: [{
                data: [42, 28, 18, 12],
                backgroundColor: ['#667eea', '#2ecc71', '#f39c12', '#e74c3c'],
                borderWidth: 0,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            cutout: '70%'
        }
    });
}

function updateChartColors() {
    initRevenueChart();
    initTrafficChart();
}

// ===== CHART TABS =====
document.querySelectorAll('.chart-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const data = tab.textContent === 'Weekly' ? weeklyData : monthlyData;
        initRevenueChart(data);
    });
});

// ===== INIT =====
function init() {
    loadTheme();
    renderOrders();
    renderProducts();
    renderActivity();
    initRevenueChart();
    initTrafficChart();
    setTimeout(initCounters, 300);
}

init();