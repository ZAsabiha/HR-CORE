import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { adminRouter } from './Routes/AdminRoute.js';
import { EmployeeRouter } from './Routes/EmployeeRoute.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/auth', adminRouter);
app.use('/employee', EmployeeRouter);

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
