import mysql from 'mysql';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hr_core'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database ✅');
});

export default db;
