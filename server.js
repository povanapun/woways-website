require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const basicAuth = require('express-basic-auth');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Database (JSON file, no external DB needed) ----------
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const adapter = new FileSync(path.join(dataDir, 'db.json'));
const db = low(adapter);

const defaultContent = require('./content.default.json');
db.defaults({ content: defaultContent, leads: [] }).write();

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme123';

const adminAuth = basicAuth({
  users: { [ADMIN_USER]: ADMIN_PASSWORD },
  challenge: true,
  realm: 'Woways Admin'
});

// ---------- Public API: site content ----------
// The frontend fetches this on load and fills in the page text.
app.get('/api/content', (req, res) => {
  res.json(db.get('content').value());
});

// ---------- Public API: lead capture ----------
app.post('/api/leads', (req, res) => {
  const { fullName, designation, email, phone, entityName, interest, message } = req.body || {};

  if (!fullName || !email || !phone || !entityName) {
    return res.status(400).json({ error: 'Please fill in name, email, phone and company name.' });
  }

  const lead = {
    id: uuidv4(),
    fullName: String(fullName).trim(),
    designation: String(designation || '').trim(),
    email: String(email).trim(),
    phone: String(phone).trim(),
    entityName: String(entityName).trim(),
    interest: String(interest || '').trim(),
    message: String(message || '').trim(),
    submittedAt: new Date().toISOString()
  };

  db.get('leads').push(lead).write();
  res.json({ success: true, lead });
});

// ---------- Admin: content editing (protected) ----------
app.put('/api/content', adminAuth, (req, res) => {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Invalid content payload.' });
  }
  db.set('content', req.body).write();
  res.json({ success: true });
});

// ---------- Admin: view leads (protected) ----------
app.get('/api/leads', adminAuth, (req, res) => {
  const leads = db.get('leads').value().slice().reverse(); // newest first
  res.json(leads);
});

app.delete('/api/leads/:id', adminAuth, (req, res) => {
  db.get('leads').remove({ id: req.params.id }).write();
  res.json({ success: true });
});

app.get('/api/leads/export', adminAuth, (req, res) => {
  const leads = db.get('leads').value();
  const headers = ['fullName', 'designation', 'email', 'phone', 'entityName', 'interest', 'message', 'submittedAt'];
  const escape = (v) => `"${String(v || '').replace(/"/g, '""')}"`;
  const rows = [headers.join(',')].concat(
    leads.map((l) => headers.map((h) => escape(l[h])).join(','))
  );
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="woways-leads.csv"');
  res.send(rows.join('\n'));
});

// ---------- Admin UI (protected) ----------
app.use('/admin', adminAuth, express.static(path.join(__dirname, 'admin')));

// ---------- Health check ----------
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Woways server running on port ${PORT}`);
  console.log(`Admin panel available at /admin (user: ${ADMIN_USER})`);
});
