const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'myplanner',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.post('/api/calendar-plan/save', async (req, res) => {
  const { keyword, password, plan } = req.body;
  console.log('Solicitud de guardado:', { keyword, plan });
  if (!keyword || !password || !plan) {
    return res.status(400).json({ message: 'Faltan datos' });
  }
  try {
    const [rows] = await db.query('SELECT * FROM calendar_plans WHERE keyword = ?', [keyword]);
    let passwordHash;
    if (rows.length > 0) {
      // Update
      const match = await bcrypt.compare(password, rows[0].password_hash);
      if (!match) return res.status(403).json({ message: 'Contraseña incorrecta' });
      passwordHash = rows[0].password_hash;
      await db.query(
        'UPDATE calendar_plans SET plan_json = ?, last_updated = NOW() WHERE keyword = ?',
        [JSON.stringify(plan), keyword]
      );
    } else {
      // Insert
      passwordHash = await bcrypt.hash(password, 10);
      await db.query(
        'INSERT INTO calendar_plans (keyword, password_hash, plan_json) VALUES (?, ?, ?)',
        [keyword, passwordHash, JSON.stringify(plan)]
      );
    }
    const [[planRow]] = await db.query('SELECT last_updated FROM calendar_plans WHERE keyword = ?', [keyword]);
    res.json({ ok: true, lastUpdated: planRow.last_updated });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.post('/api/calendar-plan/load', async (req, res) => {
  const { keyword, password } = req.body;
  console.log('Solicitud de carga:', { keyword });
  if (!keyword || !password) {
    return res.status(400).json({ message: 'Faltan datos' });
  }
  try {
    const [rows] = await db.query('SELECT * FROM calendar_plans WHERE keyword = ?', [keyword]);
    if (rows.length === 0) return res.status(404).json({ message: 'Plan no encontrado' });
    const match = await bcrypt.compare(password, rows[0].password_hash);
    if (!match) return res.status(403).json({ message: 'Contraseña incorrecta' });
    res.json({
      ok: true,
      plan: rows[0].plan_json,
      lastUpdated: rows[0].last_updated,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API server running on port ${PORT}`);
});
