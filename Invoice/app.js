import express from 'express';
import * as db from './util/database.js';
import cors from 'cors';

const PORT = 2010;
const app = express();
app.use(express.json());
app.use(cors());

// ------------------- Customers -------------------

app.get('/customers', (req, res) => {
  try {
    const customers = db.getCustomers();
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ message: `${err}` });
  }
});

app.post('/customers', (req, res) => {
  try {
    const { name, address } = req.body;
    if (!name || !address) {
      return res.status(400).json({ message: 'Name and address are required' });
    }
    const savedCustomer = db.saveCustomer(name, address);
    res.status(201).json({ id: savedCustomer.lastInsertRowid, name, address });
  } catch (err) {
    res.status(500).json({ message: `${err}` });
  }
});

app.put('/customers/:id', (req, res) => {
  try {
    const { name, address } = req.body;
    const id = +req.params.id;
    if (!name || !address) {
      return res.status(400).json({ message: 'Name and address are required' });
    }
    const result = db.updateCustomer(id, name, address);
    res.status(200).json({ id, name, address });
  } catch (err) {
    res.status(500).json({ message: `${err}` });
  }
});

app.delete('/customers/:id', (req, res) => {
  try {
    const id = +req.params.id;
    const result = db.deleteCustomer(id);
    res.status(200).json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: `${err}` });
  }
});

// ------------------- Issuers -------------------

app.get('/issuers', (req, res) => {
  try {
    const issuers = db.getIssuers();
    res.status(200).json(issuers);
  } catch (err) {
    res.status(500).json({ message: `${err}` });
  }
});

app.post('/issuers', (req, res) => {
  try {
    const { name, address, taxNumber } = req.body;
    if (!name || !address || !taxNumber) {
      return res.status(400).json({ message: 'Name, address, and taxNumber are required' });
    }
    const savedIssuer = db.saveIssuer(name, address, taxNumber);
    res.status(201).json({ id: savedIssuer.lastInsertRowid, name, address, taxNumber });
  } catch (err) {
    res.status(500).json({ message: `${err}` });
  }
});

app.put('/issuers/:id', (req, res) => {
  try {
    const { name, address, taxNumber } = req.body;
    const id = +req.params.id;
    if (!name || !address || !taxNumber) {
      return res.status(400).json({ message: 'Name, address, and taxNumber are required' });
    }
    const result = db.updateIssuer(id, name, address, taxNumber);
    res.status(200).json({ id, name, address, taxNumber });
  } catch (err) {
    res.status(500).json({ message: `${err}` });
  }
});

app.delete('/issuers/:id', (req, res) => {
  try {
    const id = +req.params.id;
    const result = db.deleteIssuer(id);
    res.status(200).json({ message: 'Issuer deleted' });
  } catch (err) {
    res.status(500).json({ message: `${err}` });
  }
});

// ------------------- Invoices -------------------

app.get('/invoices', (req, res) => {
  try {
    const invoices = db.getInvoices();
    res.status(200).json(invoices);
  } catch (err) {
    res.status(500).json({ message: `${err}` });
  }
});

app.post('/invoices', (req, res) => {
  try {
    const {
      customerId,
      issuerId,
      invoiceNumber,
      created,
      fulfilled,
      deadline,
      total,
      vat,
    } = req.body;

    if (
      !customerId ||
      !issuerId ||
      !invoiceNumber ||
      !created ||
      !fulfilled ||
      !deadline ||
      !total ||
      vat == null
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = db.saveInvoice(
      customerId,
      issuerId,
      invoiceNumber,
      created,
      fulfilled,
      deadline,
      total,
      vat
    );

    res.status(201).json({
      id: result.lastInsertRowid,
      customerId,
      issuerId,
      invoiceNumber,
      created,
      fulfilled,
      deadline,
      total,
      vat,
    });
  } catch (err) {
    res.status(500).json({ message: `${err}` });
  }
});

app.put('/invoices/:id', (req, res) => {
  try {
    const {
      customerId,
      issuerId,
      invoiceNumber,
      fulfilled,
      deadline,
      total,
      vat,
    } = req.body;

    const id = +req.params.id;

    if (
      !customerId ||
      !issuerId ||
      !invoiceNumber ||
      !fulfilled ||
      !deadline ||
      !total ||
      vat == null
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = db.updateInvoice(
      id,
      customerId,
      issuerId,
      invoiceNumber,
      fulfilled,
      deadline,
      total,
      vat
    );

    res.status(200).json({
      id,
      customerId,
      issuerId,
      invoiceNumber,
      fulfilled,
      deadline,
      total,
      vat,
    });
  } catch (err) {
    res.status(500).json({ message: `${err}` });
  }
});

app.delete('/invoices/:id', (req, res) => {
  try {
    const id = +req.params.id;
    const result = db.deleteInvoice(id);
    res.status(200).json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ message: `${err}` });
  }
});

// ------------------- Start Server -------------------

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
