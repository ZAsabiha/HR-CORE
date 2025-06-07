import express from 'express';
import db from '../Utils/db.js';

export const EmployeeRouter = express.Router();

EmployeeRouter.get('/list', (req, res) => {
  db.query('SELECT * FROM employees', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error retrieving employees' });
    return res.json(results);
  });
});
