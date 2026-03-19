// Navigation routing configuration — maps nav keys to page metadata
export const NAV_PAGES = {
  'calendar': { title: 'Calendar', icon: 'calendar', type: 'page' },
  'inbox': { title: 'Inbox', icon: 'inbox', type: 'inbox' },
  'customers': { title: 'Clients', icon: 'users', type: 'customers' },
  'reports': { title: 'Reports', icon: 'bar-chart-3', type: 'placeholder' },
  'views-page': { title: 'Views', icon: 'layout-grid', type: 'views' },
  'billing-page': { title: 'Billing', icon: 'receipt', type: 'billing' },
  'care-page': { title: 'Care', icon: 'heart-pulse', type: 'care' },
  'inventory-page': { title: 'Inventory', icon: 'package', type: 'placeholder' },
  'ask-ai': { title: 'Ask AI', icon: 'sparkles', type: 'ask-ai' },
  'settings': { title: 'Settings', icon: 'settings', type: 'settings' },
  'diagnostic-imaging': { title: 'Diagnostic imaging', icon: 'scan', type: 'table' },
  'estimates': { title: 'Estimates', icon: 'file-text', type: 'table' },
  'invoices': { title: 'Invoices', icon: 'receipt', type: 'table' },
  'written-prescriptions': { title: 'Written prescriptions', icon: 'pill', type: 'table' },
  'health-plans': { title: 'Health plans', icon: 'heart-pulse', type: 'table' },
  'patient-referrals': { title: 'Patient referrals', icon: 'send', type: 'table' },
  'reminders': { title: 'Reminders', icon: 'bell', type: 'table' },
  'items': { title: 'Items', icon: 'box', type: 'placeholder' },
  'bundles': { title: 'Bundles', icon: 'boxes', type: 'placeholder' },
  'catalogue-management': { title: 'Catalogue management', icon: 'book-open', type: 'placeholder' },
  'stock': { title: 'Stock', icon: 'warehouse', type: 'placeholder' },
  'orders': { title: 'Orders', icon: 'shopping-cart', type: 'placeholder' },
  'stock-locations': { title: 'Stock locations', icon: 'map-pin', type: 'placeholder' },
  'wholesalers': { title: 'Wholesalers', icon: 'truck', type: 'placeholder' },
};

// Tabs displayed on inbox detail and record views
export const DETAIL_TABS = ['Chart','Medications','Immunizations','Labs','Billing','Messages','Tasks','Forms','Consultations'];

// Sidebar items config — matches the nav items in the sidebar
export const SIDEBAR_ITEMS = [
  { id: 'inbox', label: 'Inbox', icon: 'inbox', group: 'navigation' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar', group: 'navigation' },
  { id: 'customers', label: 'Clients', icon: 'users', group: 'workspace' },
  { id: 'views-page', label: 'Views', icon: 'layout-grid', group: 'workspace' },
  { id: 'billing-page', label: 'Billing', icon: 'receipt', group: 'workspace' },
  { id: 'care-page', label: 'Care', icon: 'heart-pulse', group: 'workspace' },
  { id: 'inventory-page', label: 'Inventory', icon: 'package', group: 'workspace' },
  { id: 'reports', label: 'Reports', icon: 'bar-chart-3', group: 'workspace' },
  { id: 'ask-ai', label: 'Ask AI', icon: 'sparkles', group: 'workspace' },
];

// Visibility options for sidebar customization modal
export const VISIBILITY_OPTIONS = ['Always show', 'Show when badged', 'Hide'];
