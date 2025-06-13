import express from 'express';
import db from '../Utils/db.js';

export const adminRouter = express.Router();

adminRouter.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM admins WHERE username = ? AND password = ?';

  db.query(query, [username, password], (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    return res.json({ message: 'Login successful', user: results[0] });
  });
});
