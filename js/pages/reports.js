/**
 * Reports page — dashboard with KPI cards, charts, and tables.
 * @module pages/reports
 */

const KPI_CARDS = [
  { label: 'Revenue (MTD)', value: '$28,450', change: '+12.3%', trend: 'up', icon: 'dollar-sign', color: '#57ab5a' },
  { label: 'Appointments', value: '186', change: '+8.1%', trend: 'up', icon: 'calendar-check', color: '#5e6ad2' },
  { label: 'New Clients', value: '14', change: '+3', trend: 'up', icon: 'user-plus', color: '#539bf5' },
  { label: 'Avg Wait Time', value: '12 min', change: '-2 min', trend: 'up', icon: 'clock', color: '#4dab9a' },
];

const REVENUE_DATA = [
  { month: 'Oct', value: 22400 },
  { month: 'Nov', value: 24100 },
  { month: 'Dec', value: 19800 },
  { month: 'Jan', value: 26300 },
  { month: 'Feb', value: 25100 },
  { month: 'Mar', value: 28450 },
];

const APPT_BY_TYPE = [
  { type: 'Consultation', count: 62, color: '#5e6ad2' },
  { type: 'Vaccination', count: 38, color: '#57ab5a' },
  { type: 'Surgery', count: 24, color: '#e5534b' },
  { type: 'Follow-up', count: 31, color: '#4dab9a' },
  { type: 'Dental', count: 18, color: '#cf8e3e' },
  { type: 'Diagnostics', count: 13, color: '#986ee2' },
];

const TOP_SERVICES = [
  { service: 'Annual wellness exam', count: 42, revenue: '$11,970', pct: 82 },
  { service: 'Vaccination — DHPP', count: 28, revenue: '$4,060', pct: 65 },
  { service: 'Dental cleaning', count: 18, revenue: '$8,100', pct: 54 },
  { service: 'Spay/Neuter', count: 15, revenue: '$6,750', pct: 48 },
  { service: 'Blood panel (CBC)', count: 24, revenue: '$3,360', pct: 42 },
];

const VET_PERFORMANCE = [
  { name: 'Dr. Sarah Smith', initials: 'SS', color: '#5e6ad2', appointments: 68, revenue: '$12,240', rating: '4.9' },
  { name: 'Dr. Mike Johnson', initials: 'MJ', color: '#cf8e3e', appointments: 54, revenue: '$9,720', rating: '4.8' },
  { name: 'Dr. Katie Brown', initials: 'KB', color: '#4dab9a', appointments: 41, revenue: '$6,150', rating: '4.9' },
  { name: 'Dr. Jordan Nguyen', initials: 'JN', color: '#986ee2', appointments: 23, revenue: '$4,140', rating: '4.7' },
];

const RECENT_INVOICES = [
  { id: 'INV-10232', client: 'Amy Collins', amount: '$285', status: 'Paid', date: 'Mar 16' },
  { id: 'INV-10231', client: 'David Turner', amount: '$145', status: 'Paid', date: 'Mar 15' },
  { id: 'INV-10230', client: 'Emma Patel', amount: '$680', status: 'Overdue', date: 'Mar 14' },
  { id: 'INV-10229', client: 'Rebecca Young', amount: '$450', status: 'Pending', date: 'Mar 13' },
  { id: 'INV-10228', client: 'Daniel Reyes', amount: '$195', status: 'Paid', date: 'Mar 12' },
];

export function renderReportsPage() {
  const maxRevenue = Math.max(...REVENUE_DATA.map(d => d.value));
  const maxApptCount = Math.max(...APPT_BY_TYPE.map(d => d.count));

  const revenueChart = REVENUE_DATA.map(d => {
    const h = Math.round((d.value / maxRevenue) * 120);
    const isLast = d === REVENUE_DATA[REVENUE_DATA.length - 1];
    return `<div class="rpt-bar-col">
      <div class="rpt-bar" style="height:${h}px;background:${isLast ? 'var(--color-primary)' : 'rgba(94,106,210,0.2)'}"></div>
      <span class="rpt-bar-label">${d.month}</span>
    </div>`;
  }).join('');

  const apptChart = APPT_BY_TYPE.map(d => {
    const w = Math.round((d.count / maxApptCount) * 100);
    return `<div class="rpt-hbar-row">
      <span class="rpt-hbar-label">${d.type}</span>
      <div class="rpt-hbar-track"><div class="rpt-hbar-fill" style="width:${w}%;background:${d.color}"></div></div>
      <span class="rpt-hbar-value">${d.count}</span>
    </div>`;
  }).join('');

  const servicesRows = TOP_SERVICES.map(s => `
    <div class="rpt-table-row">
      <div class="rpt-table-cell" style="flex:1;font-weight:500;color:#222;">${s.service}</div>
      <div class="rpt-table-cell" style="width:60px;text-align:center;">${s.count}</div>
      <div class="rpt-table-cell" style="width:80px;text-align:right;font-weight:500;">${s.revenue}</div>
      <div class="rpt-table-cell" style="width:80px;">
        <div class="rpt-mini-bar-track"><div class="rpt-mini-bar-fill" style="width:${s.pct}%"></div></div>
      </div>
    </div>`).join('');

  const vetRows = VET_PERFORMANCE.map(v => `
    <div class="rpt-table-row">
      <div class="rpt-table-cell" style="flex:1;display:flex;align-items:center;gap:8px;">
        <span class="rpt-vet-avatar" style="background:${v.color}">${v.initials}</span>
        <span style="font-weight:500;color:#222;">${v.name}</span>
      </div>
      <div class="rpt-table-cell" style="width:80px;text-align:center;">${v.appointments}</div>
      <div class="rpt-table-cell" style="width:80px;text-align:right;font-weight:500;">${v.revenue}</div>
      <div class="rpt-table-cell" style="width:50px;text-align:center;">
        <span class="rpt-rating"><i data-lucide="star"></i> ${v.rating}</span>
      </div>
    </div>`).join('');

  const invoiceRows = RECENT_INVOICES.map(inv => {
    const statusCls = inv.status === 'Paid' ? 'active' : inv.status === 'Overdue' ? 'overdue' : 'pending';
    return `<div class="rpt-table-row">
      <div class="rpt-table-cell" style="width:90px;font-weight:500;color:var(--color-primary);">${inv.id}</div>
      <div class="rpt-table-cell" style="flex:1;">${inv.client}</div>
      <div class="rpt-table-cell" style="width:70px;text-align:right;font-weight:500;">${inv.amount}</div>
      <div class="rpt-table-cell" style="width:70px;"><span class="status-pill ${statusCls} dot">${inv.status}</span></div>
      <div class="rpt-table-cell" style="width:60px;text-align:right;color:rgba(0,0,0,0.35);">${inv.date}</div>
    </div>`;
  }).join('');

  return `
    <div class="rpt-page">
      <div class="page-topbar">
        <span class="page-topbar-title">Reports</span>
        <div class="page-topbar-right">
          <div class="cal-view-toggle">
            <button class="cal-period-btn active">Overview</button>
            <button class="cal-period-btn">Financial</button>
            <button class="cal-period-btn">Clinical</button>
          </div>
        </div>
      </div>

      <div class="rpt-scroll">
        <!-- KPI Cards -->
        <div class="rpt-kpi-grid">
          ${KPI_CARDS.map(k => `
            <div class="rpt-kpi-card">
              <div class="rpt-kpi-header">
                <span class="rpt-kpi-label">${k.label}</span>
                <span class="rpt-kpi-icon" style="color:${k.color}"><i data-lucide="${k.icon}"></i></span>
              </div>
              <div class="rpt-kpi-value">${k.value}</div>
              <div class="rpt-kpi-change ${k.trend}">
                <i data-lucide="${k.trend === 'up' ? 'trending-up' : 'trending-down'}"></i>
                ${k.change} vs last month
              </div>
            </div>`).join('')}
        </div>

        <!-- Charts Row -->
        <div class="rpt-charts-row">
          <div class="rpt-card">
            <div class="rpt-card-title">Revenue Trend</div>
            <div class="rpt-bar-chart">${revenueChart}</div>
          </div>
          <div class="rpt-card">
            <div class="rpt-card-title">Appointments by Type</div>
            <div class="rpt-hbar-chart">${apptChart}</div>
          </div>
        </div>

        <!-- Tables Row -->
        <div class="rpt-charts-row">
          <div class="rpt-card">
            <div class="rpt-card-title">Top Services</div>
            <div class="rpt-table-head-row">
              <div class="rpt-table-cell" style="flex:1">Service</div>
              <div class="rpt-table-cell" style="width:60px;text-align:center;">Count</div>
              <div class="rpt-table-cell" style="width:80px;text-align:right;">Revenue</div>
              <div class="rpt-table-cell" style="width:80px;">Trend</div>
            </div>
            ${servicesRows}
          </div>
          <div class="rpt-card">
            <div class="rpt-card-title">Veterinarian Performance</div>
            <div class="rpt-table-head-row">
              <div class="rpt-table-cell" style="flex:1">Name</div>
              <div class="rpt-table-cell" style="width:80px;text-align:center;">Appts</div>
              <div class="rpt-table-cell" style="width:80px;text-align:right;">Revenue</div>
              <div class="rpt-table-cell" style="width:50px;text-align:center;">Rating</div>
            </div>
            ${vetRows}
          </div>
        </div>

        <!-- Recent Invoices -->
        <div class="rpt-card" style="margin:0 20px 24px;">
          <div class="rpt-card-title">Recent Invoices</div>
          <div class="rpt-table-head-row">
            <div class="rpt-table-cell" style="width:90px">Invoice</div>
            <div class="rpt-table-cell" style="flex:1">Client</div>
            <div class="rpt-table-cell" style="width:70px;text-align:right;">Amount</div>
            <div class="rpt-table-cell" style="width:70px;">Status</div>
            <div class="rpt-table-cell" style="width:60px;text-align:right;">Date</div>
          </div>
          ${invoiceRows}
        </div>
      </div>
    </div>`;
}
