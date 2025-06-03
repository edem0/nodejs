import Database from 'better-sqlite3'

const db = new Database('./data/database.sqlite')

db.prepare(`CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name STRING
)`).run()

db.prepare(`CREATE TABLE IF NOT EXISTS issuers (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name STRING
)`).run()

db.prepare(`CREATE TABLE IF NOT EXISTS invoices (
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
)`).run()

// Customers
export const getCustomers = () => db
    .prepare('SELECT * FROM customers').all()

export const saveCustomer = (name) => db
    .prepare('INSERT INTO customers (name) VALUES (?)').run(name)

export const updateCustomer = (id, name) => db
    .prepare('UPDATE customers SET name = ? WHERE id = ?').run(name, id)

export const deleteCustomer = (id) => db
    .prepare('DELETE FROM customers WHERE id = ?').run(id)

// Issuers
export const getIssuers = () => db
    .prepare('SELECT * FROM issuers').all()

export const saveIssuer = (name) => db
    .prepare('INSERT INTO issuers (name) VALUES (?)').run(name)

export const updateIssuer = (id, name) => db
    .prepare('UPDATE issuers SET name = ? WHERE id = ?').run(name, id)

export const deleteIssuer = (id) => db
    .prepare('DELETE FROM issuers WHERE id = ?').run(id)

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

export const saveInvoice = (customerId, issuerId, invoiceNumber, created, fulfilled, deadline, total, vat) => db
    .prepare('INSERT INTO invoices (customerId, issuerId, invoiceNumber, created, fulfilled, deadline, total, vat) VALUES (?,?,?,?,?,?,?,?)')
    .run(customerId, issuerId, invoiceNumber, created, fulfilled, deadline, total, vat)

export const updateInvoice = (
  id,
  customerId,
  issuerId,
  invoiceNumber,
  fulfilled,
  deadline,
  total,
  vat
) => db
  .prepare(`
    UPDATE invoices 
    SET customerId = ?, issuerId = ?, invoiceNumber = ?, 
        fulfilled = ?, deadline = ?, total = ?, vat = ?
    WHERE id = ?
  `)
  .run(customerId, issuerId, invoiceNumber, fulfilled, deadline, total, vat, id);

export const deleteInvoice = (id) => db
    .prepare('DELETE FROM invoices WHERE id = ?').run(id)


// Seed Data

const customers = [
    { name: 'Peter' },
    { name: 'John' },
    { name: 'Anna' }
]

const issuers = [
    { name: 'Clearview Company' },
    { name: 'Green Garden Company' },
    { name: 'Blue Skies Company' }
]

const d = new Date()
const actualDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:00:00`

const invoices = [
    { customerId: 1, issuerId: 1, invoiceNumber: 25565, created: actualDate, fulfilled: '2025-04-22', deadline: '2025-05-01', total: 35000, vat: 27 },
    { customerId: 2, issuerId: 2, invoiceNumber: 34456, created: actualDate, fulfilled: '2025-01-15', deadline: '2025-01-27', total: 127590, vat: 27 },
    { customerId: 3, issuerId: 3, invoiceNumber: 45567, created: actualDate, fulfilled: '2025-03-03', deadline: '2025-03-10', total: 99990, vat: 27 },
]

// const customerIds = {}
// for (const customer of customers) {
//     const result = saveCustomer(customer.name)
//     customerIds[customer.name] = result.lastInsertRowid
// }

// const issuerIds = {}
// for (const issuer of issuers) {
//     const result = saveIssuer(issuer.name)
//     issuerIds[issuer.name] = result.lastInsertRowid
// }

// for (const invoice of invoices) {
//     // Resolve actual customer ID from array index (invoice.customerId is 1-based index)
//     const customerName = customers[invoice.customerId - 1]?.name
//     const actualCustomerId = customerIds[customerName]

//     // Resolve actual issuer ID similarly
//     const issuerName = issuers[invoice.issuerId - 1]?.name
//     const actualIssuerId = issuerIds[issuerName]

//     if (!actualCustomerId || !actualIssuerId) {
//         console.error('Invalid customer or issuer for invoice:', invoice)
//         continue
//     }

//     saveInvoice(
//         actualCustomerId,
//         actualIssuerId,
//         invoice.invoiceNumber,
//         invoice.created,
//         invoice.fulfilled,
//         invoice.deadline,
//         invoice.total,
//         invoice.vat
//     )
// }
