import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { adminRouter } from './Routes/AdminRoute.js';
import { EmployeeRouter } from './Routes/EmployeeRoute.js';

const app = express();

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/auth', adminRouter);
app.use('/employee', EmployeeRouter);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});