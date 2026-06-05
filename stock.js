const refs = {
  loginSection: document.getElementById("loginSection"),
  mainSection: document.getElementById("mainSection"),
  loginName: document.getElementById("loginName"),
  loginBtn: document.getElementById("loginBtn"),
  logoutBtn: document.getElementById("logoutBtn"),
  currentUser: document.getElementById("currentUser"),
  stockSummaryBody: document.getElementById("stockSummaryBody"),
  stockAddProduct: document.getElementById("stockAddProduct"),
  stockAddNewProduct: document.getElementById("stockAddNewProduct"),
  stockAddQty: document.getElementById("stockAddQty"),
  stockAddNote: document.getElementById("stockAddNote"),
  addStockBtn: document.getElementById("addStockBtn"),
  stockWithdrawProduct: document.getElementById("stockWithdrawProduct"),
  stockWithdrawQty: document.getElementById("stockWithdrawQty"),
  stockWithdrawer: document.getElementById("stockWithdrawer"),
  stockWithdrawCustomer: document.getElementById("stockWithdrawCustomer"),
  stockWithdrawPurpose: document.getElementById("stockWithdrawPurpose"),
  stockWithdrawNote: document.getElementById("stockWithdrawNote"),
  withdrawStockBtn: document.getElementById("withdrawStockBtn"),
  stockHistoryBody: document.getElementById("stockHistoryBody")
};

const DEFAULT_STOCK_PRODUCTS = [
  { id: "sealant-locksure", name: "Sealant LOCKSURE" }
];

function makeDefaultInventory() {
  const stock = {};
  DEFAULT_STOCK_PRODUCTS.forEach((product) => {
    stock[product.id] = 0;
  });
  return { products: [...DEFAULT_STOCK_PRODUCTS], stock };
}

function normalizeInventory(data) {
  const fallback = makeDefaultInventory();
  const products = Array.isArray(data?.products) ? data.products.filter((item) => item?.id && item?.name) : [];
  const stock = (data && typeof data.stock === "object" && data.stock) ? data.stock : {};

  const mergedProducts = [...products];
  DEFAULT_STOCK_PRODUCTS.forEach((item) => {
    if (!mergedProducts.some((p) => p.id === item.id)) mergedProducts.push(item);
  });

  const normalizedStock = {};
  mergedProducts.forEach((item) => {
    normalizedStock[item.id] = Math.max(0, parseNum(stock[item.id]));
  });

  if (!mergedProducts.length) return fallback;
  return { products: mergedProducts, stock: normalizedStock };
}

function getInventory() {
  const loaded = loadJSON(STORAGE_KEYS.inventory, makeDefaultInventory());
  return normalizeInventory(loaded);
}

function setInventory(inventory) {
  saveJSON(STORAGE_KEYS.inventory, normalizeInventory(inventory));
}

function getStockTransactions() {
  const txns = loadJSON(STORAGE_KEYS.stockTransactions, []);
  return Array.isArray(txns) ? txns : [];
}

function setStockTransactions(txns) {
  saveJSON(STORAGE_KEYS.stockTransactions, Array.isArray(txns) ? txns : []);
}

function buildProductOptions(selectEl, products) {
  if (!selectEl) return;
  const currentValue = selectEl.value;
  selectEl.innerHTML = "";
  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = product.name;
    selectEl.appendChild(option);
  });
  if (products.length) {
    selectEl.value = products.some((p) => p.id === currentValue) ? currentValue : products[0].id;
  }
}

function renderStockSummary() {
  const inventory = getInventory();
  refs.stockSummaryBody.innerHTML = "";

  inventory.products.forEach((product) => {
    const tr = document.createElement("tr");
    const nameTd = document.createElement("td");
    nameTd.textContent = product.name;
    const stockTd = document.createElement("td");
    stockTd.textContent = String(parseNum(inventory.stock[product.id]));
    tr.appendChild(nameTd);
    tr.appendChild(stockTd);
    refs.stockSummaryBody.appendChild(tr);
  });

  buildProductOptions(refs.stockAddProduct, inventory.products);
  buildProductOptions(refs.stockWithdrawProduct, inventory.products);
}

function renderStockHistory() {
  const inventory = getInventory();
  const productMap = new Map(inventory.products.map((item) => [item.id, item.name]));
  const transactions = getStockTransactions();
  refs.stockHistoryBody.innerHTML = "";

  [...transactions].reverse().forEach((txn) => {
    const tr = document.createElement("tr");
    const cells = [
      formatDateTime(txn.createdAt),
      txn.type === "withdraw" ? "เบิก" : "เพิ่ม",
      productMap.get(txn.productId) || txn.productName || "-",
      String(parseNum(txn.qty)),
      txn.withdrawer || "-",
      txn.customerName || "-",
      txn.purpose || "-",
      txn.note || "-"
    ];

    cells.forEach((value) => {
      const td = document.createElement("td");
      td.textContent = String(value);
      tr.appendChild(td);
    });

    refs.stockHistoryBody.appendChild(tr);
  });
}

function renderStockView() {
  renderStockSummary();
  renderStockHistory();
}

function findOrCreateProductForAdd() {
  const inventory = getInventory();
  const newProductName = refs.stockAddNewProduct.value.trim();

  if (newProductName) {
    const existing = inventory.products.find((item) => item.name.toLowerCase() === newProductName.toLowerCase());
    if (existing) return { inventory, product: existing, isNew: false };

    const product = {
      id: `product-${Date.now()}`,
      name: newProductName
    };
    inventory.products.push(product);
    inventory.stock[product.id] = 0;
    return { inventory, product, isNew: true };
  }

  const selected = inventory.products.find((item) => item.id === refs.stockAddProduct.value) || inventory.products[0];
  return { inventory, product: selected, isNew: false };
}

function addStock() {
  const qty = Math.floor(parseNum(refs.stockAddQty.value));
  if (qty <= 0) {
    alert("กรุณากรอกจำนวนที่เพิ่มให้มากกว่า 0");
    return;
  }

  const { inventory, product } = findOrCreateProductForAdd();
  if (!product) {
    alert("ไม่พบสินค้า กรุณาระบุสินค้าที่ต้องการเพิ่ม");
    return;
  }

  inventory.stock[product.id] = Math.max(0, parseNum(inventory.stock[product.id])) + qty;
  setInventory(inventory);

  const transactions = getStockTransactions();
  transactions.push({
    type: "add",
    productId: product.id,
    productName: product.name,
    qty,
    note: refs.stockAddNote.value.trim(),
    createdBy: loadJSON(STORAGE_KEYS.user, ""),
    createdAt: new Date().toISOString()
  });
  setStockTransactions(transactions);

  refs.stockAddQty.value = "";
  refs.stockAddNewProduct.value = "";
  refs.stockAddNote.value = "";
  renderStockView();
  alert(`เพิ่มสต็อกสินค้า ${product.name} จำนวน ${qty} สำเร็จ`);
}

function withdrawStock() {
  const productId = refs.stockWithdrawProduct.value;
  const qty = Math.floor(parseNum(refs.stockWithdrawQty.value));
  const withdrawer = refs.stockWithdrawer.value.trim();
  const customerName = refs.stockWithdrawCustomer.value.trim();
  const purpose = refs.stockWithdrawPurpose.value.trim();
  const note = refs.stockWithdrawNote.value.trim();

  if (!withdrawer || !customerName || !purpose) {
    alert("กรุณากรอกชื่อผู้เบิก ชื่อลูกค้า และวัตถุประสงค์การเบิก");
    return;
  }
  if (qty <= 0) {
    alert("กรุณากรอกจำนวนที่เบิกให้มากกว่า 0");
    return;
  }

  const inventory = getInventory();
  const product = inventory.products.find((item) => item.id === productId);
  if (!product) {
    alert("ไม่พบสินค้าที่ต้องการเบิก");
    return;
  }

  const available = Math.max(0, parseNum(inventory.stock[product.id]));
  if (qty > available) {
    alert(`สต็อกไม่พอ: คงเหลือ ${available}`);
    return;
  }

  inventory.stock[product.id] = available - qty;
  setInventory(inventory);

  const transactions = getStockTransactions();
  transactions.push({
    type: "withdraw",
    productId: product.id,
    productName: product.name,
    qty,
    withdrawer,
    customerName,
    purpose,
    note,
    createdBy: loadJSON(STORAGE_KEYS.user, ""),
    createdAt: new Date().toISOString()
  });
  setStockTransactions(transactions);

  refs.stockWithdrawQty.value = "";
  refs.stockWithdrawCustomer.value = "";
  refs.stockWithdrawPurpose.value = "";
  refs.stockWithdrawNote.value = "";
  renderStockView();
  alert(`บันทึกการเบิกสินค้า ${product.name} จำนวน ${qty} สำเร็จ`);
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
  refs.loginSection.classList.add("hidden");
  refs.mainSection.classList.remove("hidden");
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
  refs.addStockBtn.addEventListener("click", addStock);
  refs.withdrawStockBtn.addEventListener("click", withdrawStock);
}

function bootstrap() {
  wireEvents();
  renderStockView();

  const savedUser = loadJSON(STORAGE_KEYS.user, "");
  if (savedUser) {
    refs.loginName.value = savedUser;
    setLoggedInUser(savedUser);
  }
}

bootstrap();
