import Database from 'better-sqlite3';

const db = new Database('./data/database.sqlite');

// Create tables
db.prepare(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL,
    address TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS issuers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT,
    taxNumber INTEGER
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    customerId INTEGER, 
    issuerId INTEGER, 
    invoiceNumber INTEGER, 
    created DATE, 
    fulfilled DATE, 
    deadline DATE, 
    total INTEGER, 
    vat INTEGER,
    FOREIGN KEY(customerId) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY(issuerId) REFERENCES issuers(id) ON DELETE CASCADE
  )
`).run();

// Customers
export const getCustomers = () => db
  .prepare('SELECT * FROM customers')
  .all();

export const saveCustomer = (name, address) => db
  .prepare('INSERT INTO customers (name, address) VALUES (?, ?)')
  .run(name, address);

export const updateCustomer = (id, name, address) => db
  .prepare('UPDATE customers SET name = ?, address = ? WHERE id = ?')
  .run(name, address, id);

export const deleteCustomer = (id) => db
  .prepare('DELETE FROM customers WHERE id = ?')
  .run(id);

// Issuers
export const getIssuers = () => db
  .prepare('SELECT * FROM issuers')
  .all();

export const saveIssuer = (name, address, taxNumber) => db
  .prepare('INSERT INTO issuers (name, address, taxNumber) VALUES (?, ?, ?)')
  .run(name, address, taxNumber);

export const updateIssuer = (id, name, address, taxNumber) => db
  .prepare('UPDATE issuers SET name = ?, address = ?, taxNumber = ? WHERE id = ?')
  .run(name, address, taxNumber, id);

export const deleteIssuer = (id) => db
  .prepare('DELETE FROM issuers WHERE id = ?')
  .run(id);

// Invoices
export const getInvoices = () => db
  .prepare(`
    SELECT 
      invoices.*, 
      customers.name AS customerName, 
      issuers.name AS issuerName 
    FROM invoices
    LEFT JOIN customers ON invoices.customerId = customers.id
    LEFT JOIN issuers ON invoices.issuerId = issuers.id
  `)
  .all();

export const saveInvoice = (
  customerId, issuerId, invoiceNumber, created, fulfilled, deadline, total, vat
) => db
  .prepare(`
    INSERT INTO invoices 
    (customerId, issuerId, invoiceNumber, created, fulfilled, deadline, total, vat)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)
  .run(customerId, issuerId, invoiceNumber, created, fulfilled, deadline, total, vat);

export const updateInvoice = (
  id, customerId, issuerId, invoiceNumber, fulfilled, deadline, total, vat
) => db
  .prepare(`
    UPDATE invoices 
    SET customerId = ?, issuerId = ?, invoiceNumber = ?, 
        fulfilled = ?, deadline = ?, total = ?, vat = ?
    WHERE id = ?
  `)
  .run(customerId, issuerId, invoiceNumber, fulfilled, deadline, total, vat, id);

export const deleteInvoice = (id) => db
  .prepare('DELETE FROM invoices WHERE id = ?')
  .run(id);






// Seeding data

// const customers = [
//   { name: 'Peter', address: '123 Elm Street' },
//   { name: 'John', address: '456 Oak Avenue' },
//   { name: 'Anna', address: '789 Pine Road' }
// ];

// const issuers = [
//   { name: 'Clearview Company', address: '10 Broad St', taxNumber: 123456 },
//   { name: 'Green Garden Company', address: '20 Hill Rd', taxNumber: 654321 },
//   { name: 'Blue Skies Company', address: '30 River Way', taxNumber: 789123 }
// ];

// const getRandomDate = () => {
//   const now = new Date();
//   const past = new Date();
//   past.setFullYear(now.getFullYear() - 3);

//   const randomTimestamp = past.getTime() + Math.random() * (now.getTime() - past.getTime());
//   const date = new Date(randomTimestamp);
//   return date.toISOString().split('T')[0]; // YYYY-MM-DD 00:00:00
// };

// const randomItem = arr => arr[Math.floor(Math.random() * arr.length)];

// customers.forEach(c => saveCustomer(c.name, c.address));
// issuers.forEach(i => saveIssuer(i.name, i.address, i.taxNumber));

// const allCustomers = getCustomers();
// const allIssuers = getIssuers();

// let invoiceCounter = 1;

// allCustomers.forEach(customer => {
//   for (let i = 0; i < 3; i++) {
//     const issuer = randomItem(allIssuers);
//     const created = getRandomDate();
//     const fulfilled = getRandomDate();
//     const deadline = getRandomDate();

//     const total = Math.floor(Math.random() * 1000) + 100;
//     const vat = Math.floor(total * 0.2);

//     saveInvoice(
//       customer.id,
//       issuer.id,
//       invoiceCounter++,
//       created,
//       fulfilled,
//       deadline,
//       total,
//       vat
//     );
//   }
// });

// console.log('Database seeded with random data.');


