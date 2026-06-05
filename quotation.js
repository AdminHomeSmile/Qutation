const refs = {
  loginSection: document.getElementById("loginSection"),
  mainSection: document.getElementById("mainSection"),
  loginName: document.getElementById("loginName"),
  loginBtn: document.getElementById("loginBtn"),
  logoutBtn: document.getElementById("logoutBtn"),
  currentUser: document.getElementById("currentUser"),
  tabQuote: document.getElementById("tabQuote"),
  tabDashboard: document.getElementById("tabDashboard"),
  quoteView: document.getElementById("quoteView"),
  dashboardView: document.getElementById("dashboardView"),
  quoteNumber: document.getElementById("quoteNumber"),
  quoteDate: document.getElementById("quoteDate"),
  saleType: document.getElementById("saleType"),
  customerSelect: document.getElementById("customerSelect"),
  customerName: document.getElementById("customerName"),
  customerType: document.getElementById("customerType"),
  customerAddress: document.getElementById("customerAddress"),
  customerTaxId: document.getElementById("customerTaxId"),
  invoiceAddress: document.getElementById("invoiceAddress"),
  projectName: document.getElementById("projectName"),
  deliveryLocation: document.getElementById("deliveryLocation"),
  addCustomerBtn: document.getElementById("addCustomerBtn"),
  removeCustomerBtn: document.getElementById("removeCustomerBtn"),
  itemsBody: document.getElementById("itemsBody"),
  addItemBtn: document.getElementById("addItemBtn"),
  costWarning: document.getElementById("costWarning"),
  agentDiscountBlock: document.getElementById("agentDiscountBlock"),
  agentDiscountType: document.getElementById("agentDiscountType"),
  agentDiscountValue: document.getElementById("agentDiscountValue"),
  customerDiscountType: document.getElementById("customerDiscountType"),
  customerDiscountValue: document.getElementById("customerDiscountValue"),
  vatRate: document.getElementById("vatRate"),
  creditTerm: document.getElementById("creditTerm"),
  paymentMethod: document.getElementById("paymentMethod"),
  includeShipping: document.getElementById("includeShipping"),
  condition1: document.getElementById("condition1"),
  condition2: document.getElementById("condition2"),
  preparedBy: document.getElementById("preparedBy"),
  salesName: document.getElementById("salesName"),
  approverName: document.getElementById("approverName"),
  approvalSent: document.getElementById("approvalSent"),
  approvalGranted: document.getElementById("approvalGranted"),
  sendApprovalBtn: document.getElementById("sendApprovalBtn"),
  subtotalText: document.getElementById("subtotalText"),
  agentDiscountText: document.getElementById("agentDiscountText"),
  customerDiscountText: document.getElementById("customerDiscountText"),
  beforeVatText: document.getElementById("beforeVatText"),
  vatText: document.getElementById("vatText"),
  grandTotalText: document.getElementById("grandTotalText"),
  saveQuoteBtn: document.getElementById("saveQuoteBtn"),
  printBtn: document.getElementById("printBtn"),
  dailyCount: document.getElementById("dailyCount"),
  dailyTotal: document.getElementById("dailyTotal"),
  monthlyCount: document.getElementById("monthlyCount"),
  monthlyTotal: document.getElementById("monthlyTotal"),
  allCount: document.getElementById("allCount"),
  allTotal: document.getElementById("allTotal"),
  quoteHistoryBody: document.getElementById("quoteHistoryBody"),
  printCustomerName: document.getElementById("printCustomerName"),
  printQuoteDate: document.getElementById("printQuoteDate"),
  printQuoteNumber: document.getElementById("printQuoteNumber"),
  printInvoiceAddress: document.getElementById("printInvoiceAddress"),
  printProjectName: document.getElementById("printProjectName"),
  printCustomerTaxId: document.getElementById("printCustomerTaxId"),
  printDeliveryLocation: document.getElementById("printDeliveryLocation"),
  printItemsBody: document.getElementById("printItemsBody"),
  printItemsCount: document.getElementById("printItemsCount"),
  printSubtotal: document.getElementById("printSubtotal"),
  printVatRate: document.getElementById("printVatRate"),
  printVat: document.getElementById("printVat"),
  printGrandTotal: document.getElementById("printGrandTotal"),
  printAmountText: document.getElementById("printAmountText"),
  printPaymentMethod: document.getElementById("printPaymentMethod"),
  printCreditTerm: document.getElementById("printCreditTerm"),
  printPreparedBy: document.getElementById("printPreparedBy"),
  printApproverName: document.getElementById("printApproverName")
};

const state = {
  items: [],
  totals: { subtotal: 0, agentDiscount: 0, customerDiscount: 0, beforeVat: 0, vat: 0, grandTotal: 0 },
  isCostViolation: false
};

function buildItemRow(item = { name: "", qty: 1, cost: 0, price: 0, discountType: "none", discountValue: 0 }) {
  const tr = document.createElement("tr");

  const nameTd = document.createElement("td");
  const nameInput = document.createElement("input");
  nameInput.value = item.name;
  nameInput.placeholder = "ชื่อสินค้า";
  nameInput.addEventListener("input", syncItemsFromTable);
  nameTd.appendChild(nameInput);

  const qtyTd = document.createElement("td");
  const qtyInput = document.createElement("input");
  qtyInput.type = "number";
  qtyInput.min = "0";
  qtyInput.step = "1";
  qtyInput.value = String(item.qty);
  qtyInput.addEventListener("input", syncItemsFromTable);
  qtyTd.appendChild(qtyInput);

  const costTd = document.createElement("td");
  const costInput = document.createElement("input");
  costInput.type = "number";
  costInput.min = "0";
  costInput.step = "0.01";
  costInput.value = String(item.cost);
  costInput.addEventListener("input", syncItemsFromTable);
  costTd.appendChild(costInput);

  const priceTd = document.createElement("td");
  const priceInput = document.createElement("input");
  priceInput.type = "number";
  priceInput.min = "0";
  priceInput.step = "0.01";
  priceInput.value = String(item.price);
  priceInput.addEventListener("input", syncItemsFromTable);
  priceTd.appendChild(priceInput);

  const discountTd = document.createElement("td");
  const discountWrap = document.createElement("div");
  discountWrap.className = "discount-row";
  const discountType = document.createElement("select");
  ["none", "percent", "amount"].forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value === "none" ? "ไม่ใช้" : value === "percent" ? "%" : "บาท";
    if (value === item.discountType) option.selected = true;
    discountType.appendChild(option);
  });
  discountType.addEventListener("change", syncItemsFromTable);
  const discountValue = document.createElement("input");
  discountValue.type = "number";
  discountValue.min = "0";
  discountValue.step = "0.01";
  discountValue.value = String(item.discountValue);
  discountValue.addEventListener("input", syncItemsFromTable);
  discountWrap.appendChild(discountType);
  discountWrap.appendChild(discountValue);
  discountTd.appendChild(discountWrap);

  const totalTd = document.createElement("td");
  totalTd.className = "line-total";
  totalTd.textContent = "0.00";

  const actionsTd = document.createElement("td");
  const removeBtn = document.createElement("button");
  removeBtn.className = "btn btn-danger";
  removeBtn.textContent = "ลบ";
  removeBtn.addEventListener("click", () => {
    tr.remove();
    syncItemsFromTable();
  });
  actionsTd.appendChild(removeBtn);

  [nameTd, qtyTd, costTd, priceTd, discountTd, totalTd, actionsTd].forEach((td) => tr.appendChild(td));
  refs.itemsBody.appendChild(tr);
}

function syncItemsFromTable() {
  const rows = [...refs.itemsBody.querySelectorAll("tr")];
  state.items = rows.map((tr) => {
    const inputs = tr.querySelectorAll("input,select");
    const name = inputs[0].value.trim();
    const qty = Math.max(0, parseNum(inputs[1].value));
    const cost = Math.max(0, parseNum(inputs[2].value));
    const price = Math.max(0, parseNum(inputs[3].value));
    const discountType = inputs[4].value;
    const discountValue = Math.max(0, parseNum(inputs[5].value));

    const base = qty * price;
    const discount = computeDiscount(discountType, discountValue, base);
    const net = Math.max(0, base - discount);
    tr.querySelector(".line-total").textContent = formatMoney(net);

    return { name, qty, cost, price, discountType, discountValue, base, discount, net };
  }).filter((item) => item.name || item.qty || item.price || item.cost);

  recalcTotals();
}

function computeDiscount(type, value, baseAmount) {
  if (type === "percent") return Math.min(baseAmount, (baseAmount * value) / 100);
  if (type === "amount") return Math.min(baseAmount, value);
  return 0;
}

function recalcTotals() {
  const subtotal = state.items.reduce((sum, item) => sum + item.net, 0);
  const agentDiscount = refs.saleType.value === "agent"
    ? computeDiscount(refs.agentDiscountType.value, parseNum(refs.agentDiscountValue.value), subtotal)
    : 0;
  const afterAgent = Math.max(0, subtotal - agentDiscount);
  const customerDiscount = computeDiscount(refs.customerDiscountType.value, parseNum(refs.customerDiscountValue.value), afterAgent);
  const beforeVat = Math.max(0, afterAgent - customerDiscount);
  const vat = (beforeVat * Math.max(0, parseNum(refs.vatRate.value))) / 100;
  const grandTotal = beforeVat + vat;

  state.isCostViolation = state.items.some((item) => item.price < item.cost && item.qty > 0);
  refs.costWarning.classList.toggle("hidden", !state.isCostViolation);

  state.totals = { subtotal, agentDiscount, customerDiscount, beforeVat, vat, grandTotal };
  refs.subtotalText.textContent = formatMoney(subtotal);
  refs.beforeVatText.textContent = formatMoney(beforeVat);
  refs.vatText.textContent = formatMoney(vat);
  refs.grandTotalText.textContent = formatMoney(grandTotal);

  refs.agentDiscountText.classList.toggle("hidden", !(refs.saleType.value === "agent" && agentDiscount > 0));
  refs.agentDiscountText.querySelector("strong").textContent = `${formatMoney(agentDiscount)}`;
  refs.customerDiscountText.classList.toggle("hidden", !(customerDiscount > 0));
  refs.customerDiscountText.querySelector("strong").textContent = `${formatMoney(customerDiscount)}`;

  const hasAnyDiscount = state.items.some((item) => item.discount > 0) || agentDiscount > 0 || customerDiscount > 0;
  refs.quoteView.classList.toggle("hide-discount-print", !hasAnyDiscount);
  syncPrintPreview();
}

function refreshSaleTypeUI() {
  const isAgent = refs.saleType.value === "agent";
  refs.agentDiscountBlock.classList.toggle("hidden", !isAgent);
  recalcTotals();
}

function getCustomers() {
  return loadJSON(STORAGE_KEYS.customers, []);
}

function setCustomers(customers) {
  saveJSON(STORAGE_KEYS.customers, customers);
}

function renderCustomers() {
  const customers = getCustomers();
  refs.customerSelect.innerHTML = "";
  const blankOption = document.createElement("option");
  blankOption.value = "";
  blankOption.textContent = "-- เลือกลูกค้า --";
  refs.customerSelect.appendChild(blankOption);
  customers.forEach((customer) => {
    const option = document.createElement("option");
    option.value = customer.id;
    option.textContent = `${customer.name} (${customer.type === "company" ? "บริษัท" : "ทั่วไป"})`;
    refs.customerSelect.appendChild(option);
  });
}

function fillCustomerFormById(id) {
  const customer = getCustomers().find((item) => item.id === id);
  if (!customer) return;
  refs.customerName.value = customer.name;
  refs.customerType.value = customer.type;
  refs.customerAddress.value = customer.address;
  refs.customerTaxId.value = customer.taxId || "";
  refs.invoiceAddress.value = customer.invoiceAddress || customer.address || "";
  refs.projectName.value = customer.projectName || "";
  refs.deliveryLocation.value = customer.deliveryLocation || "";
  syncPrintPreview();
}

function addOrUpdateCustomer() {
  const name = refs.customerName.value.trim();
  if (!name) {
    alert("กรุณากรอกชื่อลูกค้า");
    return;
  }

  const customers = getCustomers();
  const existing = customers.find((item) => item.name.toLowerCase() === name.toLowerCase());
  const payload = {
    id: existing ? existing.id : `C${Date.now()}`,
    name,
    type: refs.customerType.value,
    address: refs.customerAddress.value.trim(),
    taxId: refs.customerTaxId.value.trim(),
    invoiceAddress: refs.invoiceAddress.value.trim(),
    projectName: refs.projectName.value.trim(),
    deliveryLocation: refs.deliveryLocation.value.trim()
  };

  const next = existing
    ? customers.map((item) => (item.id === existing.id ? payload : item))
    : [...customers, payload];

  setCustomers(next);
  renderCustomers();
  refs.customerSelect.value = payload.id;
}

function removeCustomer() {
  const id = refs.customerSelect.value;
  if (!id) return;
  const next = getCustomers().filter((item) => item.id !== id);
  setCustomers(next);
  refs.customerName.value = "";
  refs.customerAddress.value = "";
  refs.customerTaxId.value = "";
  refs.invoiceAddress.value = "";
  refs.projectName.value = "";
  refs.deliveryLocation.value = "";
  refs.customerType.value = "general";
  refs.customerSelect.value = "";
  renderCustomers();
  syncPrintPreview();
}

function getCounters() {
  return loadJSON(STORAGE_KEYS.counters, { QTC: 0, QTD: 0 });
}

function nextQuoteNumber(prefix) {
  const counters = getCounters();
  counters[prefix] = (counters[prefix] || 0) + 1;
  saveJSON(STORAGE_KEYS.counters, counters);
  return `${prefix}${String(counters[prefix]).padStart(5, "0")}`;
}

function getQuotes() {
  return loadJSON(STORAGE_KEYS.quotes, []);
}

function setQuotes(quotes) {
  saveJSON(STORAGE_KEYS.quotes, quotes);
}

function buildQuotePayload() {
  return {
    quoteNumber: nextQuoteNumber(refs.saleType.value === "agent" ? "QTD" : "QTC"),
    quoteDate: refs.quoteDate.value,
    saleType: refs.saleType.value,
    customer: {
      id: refs.customerSelect.value,
      name: refs.customerName.value.trim(),
      type: refs.customerType.value,
      address: refs.customerAddress.value.trim(),
      taxId: refs.customerTaxId.value.trim(),
      invoiceAddress: refs.invoiceAddress.value.trim(),
      projectName: refs.projectName.value.trim(),
      deliveryLocation: refs.deliveryLocation.value.trim()
    },
    items: state.items,
    discounts: {
      agent: { type: refs.agentDiscountType.value, value: parseNum(refs.agentDiscountValue.value) },
      customer: { type: refs.customerDiscountType.value, value: parseNum(refs.customerDiscountValue.value) }
    },
    vatRate: parseNum(refs.vatRate.value),
    creditTerm: refs.creditTerm.value,
    paymentMethod: refs.paymentMethod.value,
    includeShipping: refs.includeShipping.checked,
    condition1: refs.condition1.value,
    condition2: refs.condition2.value,
    preparedBy: refs.preparedBy.value.trim(),
    salesName: refs.salesName.value.trim(),
    approverName: refs.approverName.value.trim(),
    approvalSent: refs.approvalSent.checked,
    approvalGranted: refs.approvalGranted.checked,
    createdBy: loadJSON(STORAGE_KEYS.user, ""),
    totals: state.totals,
    createdAt: new Date().toISOString()
  };
}

function validateBeforeSave() {
  if (!refs.customerName.value.trim()) {
    alert("กรุณากรอกชื่อลูกค้าก่อนบันทึก");
    return false;
  }
  if (!state.items.length) {
    alert("กรุณาเพิ่มรายการสินค้าอย่างน้อย 1 รายการ");
    return false;
  }
  if (!refs.preparedBy.value.trim() || !refs.salesName.value.trim()) {
    alert("กรุณากรอกชื่อผู้จัดทำและชื่อเซลล์");
    return false;
  }
  if (state.isCostViolation && (!refs.approvalSent.checked || !refs.approvalGranted.checked || !refs.approverName.value.trim())) {
    alert("ราคาต่ำกว่าทุน: ต้องได้รับอนุมัติและระบุชื่อผู้อนุมัติก่อนบันทึก");
    return false;
  }
  return true;
}

function resetForNextQuote() {
  refs.quoteNumber.value = "";
  refs.approvalSent.checked = false;
  refs.approvalGranted.checked = false;
  refs.approverName.value = "";
  refs.salesName.value = "";
  refs.itemsBody.innerHTML = "";
  buildItemRow();
  syncItemsFromTable();
  ensureDefaultDate();
  syncPrintPreview();
}

function saveQuote() {
  syncItemsFromTable();
  if (!validateBeforeSave()) return;

  const payload = buildQuotePayload();
  const quotes = getQuotes();
  quotes.push(payload);
  setQuotes(quotes);
  refs.quoteNumber.value = payload.quoteNumber;
  alert(`บันทึกใบเสนอราคาเรียบร้อย: ${payload.quoteNumber}`);
  renderDashboard();
  resetForNextQuote();
}

function renderDashboard() {
  const quotes = getQuotes();
  const today = new Date().toISOString().split("T")[0];
  const thisMonth = today.slice(0, 7);

  const daily = quotes.filter((q) => (q.quoteDate || "").startsWith(today));
  const monthly = quotes.filter((q) => (q.quoteDate || "").startsWith(thisMonth));
  const sum = (arr) => arr.reduce((total, item) => total + parseNum(item?.totals?.grandTotal), 0);

  refs.dailyCount.textContent = String(daily.length);
  refs.dailyTotal.textContent = formatMoney(sum(daily));
  refs.monthlyCount.textContent = String(monthly.length);
  refs.monthlyTotal.textContent = formatMoney(sum(monthly));
  refs.allCount.textContent = String(quotes.length);
  refs.allTotal.textContent = formatMoney(sum(quotes));

  refs.quoteHistoryBody.innerHTML = "";
  [...quotes].reverse().forEach((quote) => {
    const tr = document.createElement("tr");
    const cells = [
      quote.quoteNumber,
      quote.quoteDate,
      quote.customer?.name || "-",
      quote.saleType === "agent" ? "ผ่านเอเจนต์" : "ขายตรง",
      formatMoney(parseNum(quote?.totals?.grandTotal)),
      quote.preparedBy || "-"
    ];
    cells.forEach((text) => {
      const td = document.createElement("td");
      td.textContent = String(text);
      tr.appendChild(td);
    });
    refs.quoteHistoryBody.appendChild(tr);
  });
}

function showQuoteView() {
  refs.quoteView.classList.remove("hidden");
  refs.dashboardView.classList.add("hidden");
}

function showDashboardView() {
  refs.quoteView.classList.add("hidden");
  refs.dashboardView.classList.remove("hidden");
  renderDashboard();
}

function setLoggedInUser(userName) {
  if (!userName) {
    localStorage.removeItem(STORAGE_KEYS.user);
    refs.loginSection.classList.remove("hidden");
    refs.mainSection.classList.add("hidden");
    refs.currentUser.textContent = "-";
    return;
  }

  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userName));
  refs.currentUser.textContent = userName;
  refs.preparedBy.value = userName;
  refs.loginSection.classList.add("hidden");
  refs.mainSection.classList.remove("hidden");
}

function ensureDefaultDate() {
  if (!refs.quoteDate.value) {
    refs.quoteDate.value = new Date().toISOString().split("T")[0];
  }
}

function renderPrintItems() {
  const rows = state.items.length ? state.items : [];
  const minRows = 8;
  refs.printItemsBody.innerHTML = "";

  rows.forEach((item, index) => {
    const tr = document.createElement("tr");
    const cells = [
      String(index + 1),
      item.name || "-",
      String(item.qty || 0),
      "หน่วย",
      formatMoney(item.price),
      formatMoney(item.net)
    ];
    cells.forEach((text, cellIndex) => {
      const td = document.createElement("td");
      td.textContent = text;
      if (cellIndex >= 2) td.style.textAlign = "right";
      tr.appendChild(td);
    });
    refs.printItemsBody.appendChild(tr);
  });

  for (let i = rows.length; i < minRows; i += 1) {
    const tr = document.createElement("tr");
    tr.innerHTML = "<td>&nbsp;</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>";
    refs.printItemsBody.appendChild(tr);
  }
}

function syncPrintPreview() {
  refs.printCustomerName.textContent = refs.customerName.value.trim() || "-";
  refs.printQuoteDate.textContent = formatDateDisplay(refs.quoteDate.value);
  refs.printQuoteNumber.textContent = refs.quoteNumber.value.trim() || "-";
  refs.printInvoiceAddress.textContent = refs.invoiceAddress.value.trim() || refs.customerAddress.value.trim() || "-";
  refs.printProjectName.textContent = refs.projectName.value.trim() || "-";
  refs.printCustomerTaxId.textContent = refs.customerTaxId.value.trim() || "-";
  refs.printDeliveryLocation.textContent = refs.deliveryLocation.value.trim() || "-";
  refs.printItemsCount.textContent = String(state.items.length);
  refs.printSubtotal.textContent = formatMoney(state.totals.beforeVat);
  refs.printVatRate.textContent = String(parseNum(refs.vatRate.value));
  refs.printVat.textContent = formatMoney(state.totals.vat);
  refs.printGrandTotal.textContent = formatMoney(state.totals.grandTotal);
  refs.printAmountText.textContent = formatAmountText(state.totals.grandTotal);
  refs.printPaymentMethod.textContent = refs.paymentMethod.value || "-";
  refs.printCreditTerm.textContent = refs.creditTerm.value || "-";
  refs.printPreparedBy.textContent = refs.preparedBy.value.trim() || "-";
  refs.printApproverName.textContent = refs.approverName.value.trim() || "-";
  renderPrintItems();
}

function wireEvents() {
  refs.loginBtn.addEventListener("click", () => {
    const name = refs.loginName.value.trim();
    if (!name) {
      alert("กรุณากรอกชื่อผู้ใช้งาน");
      return;
    }
    setLoggedInUser(name);
  });

  refs.logoutBtn.addEventListener("click", () => setLoggedInUser(""));
  refs.tabQuote.addEventListener("click", showQuoteView);
  refs.tabDashboard.addEventListener("click", showDashboardView);
  refs.saleType.addEventListener("change", refreshSaleTypeUI);
  refs.customerSelect.addEventListener("change", () => fillCustomerFormById(refs.customerSelect.value));
  refs.addCustomerBtn.addEventListener("click", addOrUpdateCustomer);
  refs.removeCustomerBtn.addEventListener("click", removeCustomer);
  refs.sendApprovalBtn.addEventListener("click", () => {
    refs.approvalSent.checked = true;
    alert("ส่งอนุมัติเรียบร้อย");
  });
  refs.addItemBtn.addEventListener("click", () => {
    buildItemRow();
    syncItemsFromTable();
  });

  [
    refs.agentDiscountType,
    refs.agentDiscountValue,
    refs.customerDiscountType,
    refs.customerDiscountValue,
    refs.vatRate
  ].forEach((el) => el.addEventListener("input", recalcTotals));

  refs.saveQuoteBtn.addEventListener("click", saveQuote);
  refs.printBtn.addEventListener("click", () => window.print());

  [
    refs.quoteNumber,
    refs.quoteDate,
    refs.customerName,
    refs.invoiceAddress,
    refs.projectName,
    refs.customerTaxId,
    refs.deliveryLocation,
    refs.paymentMethod,
    refs.creditTerm,
    refs.preparedBy,
    refs.approverName
  ].forEach((el) => el.addEventListener("input", syncPrintPreview));
}

function bootstrap() {
  ensureDefaultDate();
  wireEvents();
  renderCustomers();
  buildItemRow();
  syncItemsFromTable();
  refreshSaleTypeUI();
  renderDashboard();
  syncPrintPreview();

  const savedUser = loadJSON(STORAGE_KEYS.user, "");
  if (savedUser) {
    refs.loginName.value = savedUser;
    setLoggedInUser(savedUser);
    showQuoteView();
  }
}

bootstrap();
