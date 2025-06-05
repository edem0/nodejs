const API = "http://localhost:2010";

let customersCache = [];
let issuersCache = [];

document.querySelectorAll(".sidebar nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".page").forEach(p => {
      p.classList.remove("active");
      p.classList.add("hidden");
    });

    const targetPage = document.getElementById(btn.dataset.page);
    targetPage.classList.remove("hidden");
    targetPage.classList.add("active");

    if (btn.dataset.page === "edit-invoice") {
      fetchAndRenderInvoices();
    } else if (btn.dataset.page === "new-invoice") {
      populateCustomerIssuerSelects();
    }
  });
});

async function fetchAndRender(url, listId, createItem) {
  const res = await fetch(url);
  const data = await res.json();
  const list = document.getElementById(listId);
  list.innerHTML = "";
  data.forEach(item => list.appendChild(createItem(item)));
}

function createCustomerItem(customer) {
  const li = document.createElement("li");
  li.innerHTML = `<span><strong>${customer.name}</strong></span><span>${customer.address || ''}</span>`;


  const actions = document.createElement("div");
  actions.className = "actions";

  const editBtn = document.createElement("button");
  editBtn.className = "edit";
  editBtn.textContent = "Edit";
  editBtn.onclick = () => {
    const form = document.querySelector("#customer-form");
    form.name.value = customer.name;
    form.dataset.id = customer.id;
    form.address.value = customer.address;

  };

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete";
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = async () => {
    if (!confirm(`Warning! Deleting customer "${customer.name}" will storno all related invoices. Proceed?`)) return;
    await fetch(`${API}/customers/${customer.id}`, { method: "DELETE" });
    fetchAndRender(`${API}/customers`, "customer-list", createCustomerItem);
    //STORNO RELATED INVOICES
  };

  actions.append(editBtn, deleteBtn);
  li.appendChild(actions);

  return li;
}

function createIssuerItem(issuer) {
  const li = document.createElement("li");
  li.innerHTML = `
    <span><strong>${issuer.name}</strong></span>
    <span>${issuer.address || ''}</span>
    <span>Tax Number: ${issuer.taxNumber || ''}</span>
  `;



  const actions = document.createElement("div");
  actions.className = "actions";

  const editBtn = document.createElement("button");
  editBtn.className = "edit";
  editBtn.textContent = "Edit";
  editBtn.onclick = () => {
    const form = document.querySelector("#issuer-form");
    form.name.value = issuer.name;
    form.dataset.id = issuer.id;
    form.address.value = issuer.address;
    form.taxNumber.value = issuer.taxNumber || '';
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete";
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = async () => {
    if (!confirm(`Warning! Deleting issuer "${customer.name}" will storno all related invoices. Proceed?`)) return;
    await fetch(`${API}/issuers/${issuer.id}`, { method: "DELETE" });
    fetchAndRender(`${API}/issuers`, "issuer-list", createIssuerItem);
    //STORNO RELATED INVOICES
  };

  actions.append(editBtn, deleteBtn);
  li.appendChild(actions);

  return li;
}

const customerForm = document.getElementById("customer-form");
customerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = customerForm.name.value.trim();
  if (!name) return;

  const id = customerForm.dataset.id;
  const method = id ? "PUT" : "POST";
  const url = id ? `${API}/customers/${id}` : `${API}/customers`;

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, address: customerForm.address.value })
  });

  customerForm.reset();
  delete customerForm.dataset.id;
  fetchAndRender(`${API}/customers`, "customer-list", createCustomerItem);
});

const issuerForm = document.getElementById("issuer-form");
issuerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = issuerForm.name.value.trim();
  if (!name) return;

  const id = issuerForm.dataset.id;
  const method = id ? "PUT" : "POST";
  const url = id ? `${API}/issuers/${id}` : `${API}/issuers`;

await fetch(url, {
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    name, 
    address: issuerForm.address.value,
    taxNumber: issuerForm.taxNumber.value.trim()
  })
});

  issuerForm.reset();
  delete issuerForm.dataset.id;
  fetchAndRender(`${API}/issuers`, "issuer-list", createIssuerItem);
});

async function populateCustomerIssuerSelects() {
  const customersRes = await fetch(`${API}/customers`);
  customersCache = await customersRes.json();
  const customerSelect = document.getElementById("customer-select");
  customerSelect.innerHTML = customersCache.map(c => `<option value="${c.id}">${c.name}</option>`).join("");

  const issuersRes = await fetch(`${API}/issuers`);
  issuersCache = await issuersRes.json();
  const issuerSelect = document.getElementById("issuer-select");
  issuerSelect.innerHTML = issuersCache.map(i => `<option value="${i.id}">${i.name}</option>`).join("");
}

function getCustomerNameById(id) {
  const c = customersCache.find(cust => cust.id == id);
  return c ? c.name : "(Unknown Customer)";
}

function getIssuerNameById(id) {
  const i = issuersCache.find(iss => iss.id == id);
  return i ? i.name : "(Unknown Issuer)";
}

const invoiceForm = document.getElementById("invoice-form");
invoiceForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    invoiceNumber: invoiceForm.invoiceNumber.value,
    fulfilled: invoiceForm.fulfilled.value,
    deadline: invoiceForm.deadline.value,
    total: parseFloat(invoiceForm.total.value),
    vat: parseFloat(invoiceForm.vat.value),
    customerId: invoiceForm.customerId.value,
    issuerId: invoiceForm.issuerId.value,
    created: new Date().toISOString().split("T")[0]
  };

  await fetch(`${API}/invoices`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  alert("Invoice saved!");
  invoiceForm.reset();
});

function createInvoiceItem(invoice) {
  const li = document.createElement("li");
  li.style.flexDirection = "column";
  li.style.alignItems = "flex-start";

  li.innerHTML = `
    <div><strong>Invoice Number:</strong> #${invoice.invoiceNumber}</div>
    <div><strong>Customer:</strong> ${getCustomerNameById(invoice.customerId)}</div>
    <div><strong>Issuer:</strong> ${getIssuerNameById(invoice.issuerId)}</div>
    <div><strong>Created:</strong> ${invoice.created}</div>
    <div><strong>Fulfilled:</strong> ${invoice.fulfilled}</div>
    <div><strong>Deadline:</strong> ${invoice.deadline}</div>
    <div><strong>VAT:</strong> ${invoice.vat}%</div>
    <h3>Total: ${invoice.total.toFixed(2)} HUF</h3> 
  `;

  const actions = document.createElement("div");
  actions.className = "actions";
  actions.style.marginTop = "0.5rem";

  const editBtn = document.createElement("button");
  editBtn.className = "edit";
  editBtn.textContent = "Edit";
  editBtn.onclick = () => onEditInvoice(invoice);

  // const stornoBtn = document.createElement("button");
  // editBtn.className = "storno";
  // editBtn.textContent = "Storno";
  // editBtn.onclick = () => {
  //   if (!confirm(`Storno invoice #${invoice.invoiceNumber}?`)) return;                     STORNO FUNCTION
  //   onStornoInvoice(invoice); 
  // }

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete";
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = async () => {
    if (!confirm(`Delete invoice #${invoice.invoiceNumber}?`)) return;
    await fetch(`${API}/invoices/${invoice.id}`, { method: "DELETE" });
    fetchAndRenderInvoices();
  };

  actions.append(editBtn, deleteBtn);
  li.appendChild(actions);

  return li;
}

async function fetchAndRenderInvoices() {
  await populateCustomerIssuerSelects();

  const res = await fetch(`${API}/invoices`);
  const invoices = await res.json();
  const invoiceList = document.getElementById("invoice-list");
  invoiceList.innerHTML = "";
  invoices.forEach(inv => invoiceList.appendChild(createInvoiceItem(inv)));
}

const invoiceEditFormContainer = document.getElementById("invoice-edit-form-container");
const invoiceEditForm = document.getElementById("invoice-edit-form");

async function populateEditSelects(customerId, issuerId) {
  if (!customersCache.length || !issuersCache.length) {
    await populateCustomerIssuerSelects();
  }

  invoiceEditForm.customerId.innerHTML = customersCache.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
  invoiceEditForm.customerId.value = customerId;

  invoiceEditForm.issuerId.innerHTML = issuersCache.map(i => `<option value="${i.id}">${i.name}</option>`).join("");
  invoiceEditForm.issuerId.value = issuerId;
}

async function onEditInvoice(invoice) {
  invoiceEditFormContainer.classList.remove("hidden");

  invoiceEditForm.dataset.id = invoice.id;
  invoiceEditForm.invoiceNumber.value = invoice.invoiceNumber;
  invoiceEditForm.created.value = invoice.created;
  invoiceEditForm.fulfilled.value = invoice.fulfilled;
  invoiceEditForm.deadline.value = invoice.deadline;
  invoiceEditForm.total.value = invoice.total;
  invoiceEditForm.vat.value = invoice.vat;

  await populateEditSelects(invoice.customerId, invoice.issuerId);
}

invoiceEditForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = invoiceEditForm.dataset.id;
  if (!id) return alert("No invoice selected for editing");

  const data = {
    invoiceNumber: invoiceEditForm.invoiceNumber.value,
    fulfilled: invoiceEditForm.fulfilled.value,
    deadline: invoiceEditForm.deadline.value,
    total: parseFloat(invoiceEditForm.total.value),
    vat: parseFloat(invoiceEditForm.vat.value),
    customerId: invoiceEditForm.customerId.value,
    issuerId: invoiceEditForm.issuerId.value
  };

  await fetch(`${API}/invoices/${id}`, {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  alert("Invoice updated successfully!");
  invoiceEditForm.reset();
  delete invoiceEditForm.dataset.id;
  invoiceEditFormContainer.classList.add("hidden");

  fetchAndRenderInvoices();
});

document.getElementById("cancel-edit").addEventListener("click", () => {
  invoiceEditForm.reset();
  delete invoiceEditForm.dataset.id;
  invoiceEditFormContainer.classList.add("hidden");
});

fetchAndRender(`${API}/customers`, "customer-list", createCustomerItem);
fetchAndRender(`${API}/issuers`, "issuer-list", createIssuerItem);
populateCustomerIssuerSelects();
