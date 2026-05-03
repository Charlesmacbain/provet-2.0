/* global React */
/* Shared billing store backed by localStorage. Charges and invoices live
   here so per-patient and cross-patient views read the same data. */

const STORAGE_KEY = "provet.billing.v1";

const SEED = {
  charges: [
    { id: 1, patientId: "PT-204812", patientName: "Bella Andersen", desc: "Consultation — General",     qty: 1, price: 55, paid: false, date: "30 Apr 2026" },
    { id: 2, patientId: "PT-204812", patientName: "Bella Andersen", desc: "Apoquel 16mg × 30 tablets",  qty: 1, price: 42, paid: false, date: "30 Apr 2026" },
    { id: 3, patientId: "PT-204812", patientName: "Bella Andersen", desc: "Vaccination — DHPP booster", qty: 1, price: 35, paid: true,  date: "14 Mar 2026", invoice: "INV-1042" },
    { id: 4, patientId: "PT-204813", patientName: "Milo Olsen",     desc: "Consultation — Extended",    qty: 1, price: 85, paid: false, date: "29 Apr 2026" },
    { id: 5, patientId: "PT-204814", patientName: "Luna Kowalski",  desc: "Lab — CBC + biochemistry panel", qty: 1, price: 78, paid: false, date: "28 Apr 2026" },
  ],
  invoices: [
    { id: "INV-1042", patientId: "PT-204812", patientName: "Bella Andersen", date: "14 Mar 2026", total: 35, method: "Card", items: 1 },
  ],
  nextChargeId: 6,
  nextInvoiceNum: 1043,
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...SEED };
    const parsed = JSON.parse(raw);
    return { ...SEED, ...parsed };
  } catch {
    return { ...SEED };
  }
}

let state = load();
const listeners = new Set();

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}
function emit() { listeners.forEach(fn => fn(state)); }
function update(mut) {
  state = { ...state, ...mut };
  persist();
  emit();
}

function addCharge({ patientId, patientName, desc, price, qty = 1 }) {
  const id = state.nextChargeId;
  const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  update({
    charges: [...state.charges, { id, patientId, patientName, desc, price, qty, paid: false, date }],
    nextChargeId: id + 1,
  });
  return id;
}

function removeCharge(id) {
  update({ charges: state.charges.filter(c => c.id !== id) });
}

function settle(ids, method) {
  const settling = state.charges.filter(c => ids.includes(c.id) && !c.paid);
  if (settling.length === 0) return null;
  // Group settled items by patient → one invoice per patient
  const groups = {};
  settling.forEach(c => {
    (groups[c.patientId] ||= { patientId: c.patientId, patientName: c.patientName, items: [] }).items.push(c);
  });
  const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const newInvoices = [];
  let nextNum = state.nextInvoiceNum;
  const settledIds = new Set();
  const idToInvoice = {};
  Object.values(groups).forEach(g => {
    const invId = "INV-" + nextNum++;
    const total = g.items.reduce((s, c) => s + c.qty * c.price, 0);
    newInvoices.push({
      id: invId, patientId: g.patientId, patientName: g.patientName,
      date, total, method, items: g.items.length,
    });
    g.items.forEach(c => { settledIds.add(c.id); idToInvoice[c.id] = invId; });
  });
  update({
    charges: state.charges.map(c =>
      settledIds.has(c.id) ? { ...c, paid: true, invoice: idToInvoice[c.id] } : c
    ),
    invoices: [...state.invoices, ...newInvoices],
    nextInvoiceNum: nextNum,
  });
  return newInvoices;
}

function useBilling() {
  const [snap, setSnap] = React.useState(state);
  React.useEffect(() => {
    const fn = (s) => setSnap(s);
    listeners.add(fn);
    return () => listeners.delete(fn);
  }, []);
  return snap;
}

window.PROVET_BILLING = { useBilling, addCharge, removeCharge, settle };
