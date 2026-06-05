const STORAGE_KEYS = {
  user: "qutation_current_user",
  customers: "qutation_customers",
  quotes: "qutation_quotes",
  counters: "qutation_counters",
  inventory: "qutation_inventory",
  stockTransactions: "qutation_stock_transactions"
};

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parseNum(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("th-TH");
}

function formatDateDisplay(value) {
  if (!value) return "-";
  const [y, m, d] = value.split("-");
  return y && m && d ? `${d}/${m}/${y}` : value;
}

function formatAmountText(value) {
  const amount = parseNum(value);
  if (amount <= 0) return "ศูนย์บาทถ้วน";
  return `${formatMoney(amount)} บาทถ้วน`;
}
