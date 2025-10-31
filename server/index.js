import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();



import adminRoutes from './src/routes/adminRoutes.js';
import employeeRoutes from './src/routes/employeeRoutes.js';
import goalRoutes from './src/routes/goalRoutes.js';
import reviewRoutes from './src/routes/reviewRoutes.js';
import salaryRoutes from './src/routes/salaryRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import reportingRoutes from './src/routes/reportingRoutes.js';
import leaveRoutes from './src/routes/leaveRoutes.js';
import attendanceRoutes from './src/routes/attendanceRoutes.js';
import jobRoutes from './src/routes/jobRoutes.js';
import candidateRoutes from './src/routes/candidateRoutes.js';
import interviewRoutes from './src/routes/interviewRoutes.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Email configuration 
export const createEmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Test email 
const testEmailConfig = async () => {
  try {
    const transporter = createEmailTransporter();
    await transporter.verify();
    console.log('Email service configured successfully');
  } catch (error) {
    console.log('Email service not configured:', error.message);
  }
};

const app = express();

export const testEmailConfiguration = async () => {
  const configurations = [
    { name: 'Gmail Service', transporter: createEmailTransporter() },
    // Add other configurations as needed
  ];

  for (const config of configurations) {
    try {
      console.log(`Testing ${config.name}...`);
      await config.transporter.verify();
      console.log(`✅ ${config.name} configuration is valid`);
      
      
      const info = await config.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to self for testing
        subject: `Test from ${config.name}`,
        text: `This is a test email from ${config.name} configuration`
      });
      
      console.log(`✅ Test email sent via ${config.name}:`, info.messageId);
      return config; // Return the first working configuration
      
    } catch (error) {
      console.log(`❌ ${config.name} failed:`, error.message);
    }
  }
  
  throw new Error('No email configuration worked');
};


app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

//Session configuration
app.use(session({
  secret: 'yourSuperSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
}));


// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads/cvs';
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Export prisma for use in route modules
export { prisma };

// HR System API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/employee-goals', goalRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/salaries', salaryRoutes);
app.use('/auth', express.json(), authRoutes);
app.use('/api/reports', reportingRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/attendance', attendanceRoutes);

app.use('/api/jobs', jobRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/interviews', interviewRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    services: {
      database: 'Connected',
      server: 'Running'
    }
  });
});

app.use('/api/departments', express.Router().get('/', async (req, res) => {
  const departments = await prisma.department.findMany({
    select: { id: true, name: true, _count: { select: { employees: true } } }
  });
  res.json(departments);
}));


// Combined initialization function merging both documents
async function initializeData() {
  try {
    const plainAdminPassword = 'securepassword123';
    const hashedAdminPassword = await bcrypt.hash(plainAdminPassword, 10);

    // Hash passwords for team lead and employee
    const hashedTeamLeadPassword = await bcrypt.hash('team123', 10);
    const hashedEmployeePassword = await bcrypt.hash('employee123', 10);

    const designDept = await prisma.department.upsert({
      where: { name: 'Design' },
      update: {},
      create: { name: 'Design' }
    });

    const engineeringDept = await prisma.department.upsert({
      where: { name: 'Engineering' },
      update: {},
      create: { name: 'Engineering' }
    });

    const marketingDept = await prisma.department.upsert({
      where: { name: 'Marketing' },
      update: {},
      create: { name: 'Marketing' }
    });

    // Admin (with ADMIN role)
    const admin = await prisma.admin.upsert({
      where: { email: 'admin@hrcore.com' },
      update: { password: hashedAdminPassword },
      create: {
        name: 'HR Admin',
        email: 'admin@hrcore.com',
        password: hashedAdminPassword,
      }
    });

    // Create default Team Lead account
  const teamLead = await prisma.employee.upsert({
  where: { email: 'teamlead@hrcore.com' },
  update: { password: hashedTeamLeadPassword },
  create: {
    name: 'Team Lead User',
    email: 'teamlead@hrcore.com',
    password: hashedTeamLeadPassword,
    role: 'TEAM_LEAD',
    salary: 70000,
    departmentId: designDept.id,
    position: 'Senior UI UX Designer',
    status: 'Active',                       
    joinDate: new Date('2021-01-15'),
    dateOfBirth: new Date('1993-07-10'),   
    experience: 5,
  }
});

const defaultEmployee = await prisma.employee.upsert({
  where: { email: 'employee@hrcore.com' },
  update: { password: hashedEmployeePassword },
  create: {
    name: 'Employee User',
    email: 'employee@hrcore.com',
    password: hashedEmployeePassword,
    role: 'EMPLOYEE',
    salary: 45000,
    departmentId: designDept.id,
    position: 'Junior UI UX Designer',
    status: 'Active',
    joinDate: new Date('2023-06-01'),
    dateOfBirth: new Date('1999-04-22'),   
    experience: 1,
  }
});

    const existingEmployees = await prisma.employee.findMany();
    const employeeRecords = [];

    // Update existing employees without passwords
    for (const emp of existingEmployees) {
      if (!emp.password && emp.email !== 'teamlead@hrcore.com' && emp.email !== 'employee@hrcore.com') {
        // Assign default password to existing employees
        const defaultPassword = await bcrypt.hash('default123', 10);
        await prisma.employee.update({
          where: { id: emp.id },
          data: { password: defaultPassword }
        });
      }
    }

    // Create additional employees if none exist (excluding the default accounts)
    const regularEmployees = existingEmployees.filter(emp => 
      emp.email !== 'teamlead@hrcore.com' && emp.email !== 'employee@hrcore.com'
    );

  
 
    if (regularEmployees.length === 0) {
  const employeesData = [
    { name: 'Sanjana Afreen', position: 'UI UX Designer', role: 'TEAM_LEAD', gender: 'Female', departmentId: designDept.id, dob: '1996-05-12' },
    { name: 'Israt Risha Ivey', position: 'Backend Engineer', role: 'EMPLOYEE', gender: 'Female', departmentId: engineeringDept.id, dob: '1998-11-03' },
    { name: 'Zannatul Adon', position: 'UI UX Designer', role: 'EMPLOYEE', gender: 'Female', departmentId: designDept.id, dob: '1999-02-21' },
    { name: 'Nishat Tasnim', position: 'UI UX Designer', role: 'EMPLOYEE', gender: 'Female', departmentId: designDept.id, dob: '1997-07-30' },
    { name: 'Ayesha Binte Anis', position: 'UI UX Designer', role: 'EMPLOYEE', gender: 'Female', departmentId: designDept.id, dob: '1996-12-17' },
    { name: 'Adrita Ahsan', position: 'UI UX Designer', role: 'EMPLOYEE', gender: 'Female', departmentId: designDept.id, dob: '1998-04-05' },
    { name: 'Labiba Karim', position: 'UI UX Designer', role: 'EMPLOYEE', gender: 'Female', departmentId: designDept.id, dob: '1999-09-14' },
  ];

  for (let i = 0; i < employeesData.length; i++) {
    const e = employeesData[i];
    const defaultPassword = await bcrypt.hash('default123', 10);
    const employee = await prisma.employee.create({
      data: {
        name: e.name,
        email: `${e.name.toLowerCase().replace(/ /g, '.')}@hrcore.com`,
        password: defaultPassword,
        role: e.role,
        salary: 50000 + i * 2000,
        departmentId: e.departmentId,
        position: e.position,
        status: 'Active',                 
        joinDate: new Date('2022-04-28'),
        dateOfBirth: new Date(e.dob),     
        experience: 2 + i,
             
      }
    });
    employeeRecords.push(employee);
  }
    } else {
      employeeRecords.push(...regularEmployees);
    }

   
    employeeRecords.push(teamLead, defaultEmployee);

    // Continue with existing seeding logic for goals, attendance, etc.
    for (const emp of employeeRecords) {
      const empId = emp.id;

      if (!await prisma.goal.findFirst({ where: { employeeId: empId } })) {
        await prisma.goal.create({
          data: {
            employeeId: empId,
            name: emp.name,
            goalTitle: `Improve ${emp.position}`,
            description: `Achieve performance excellence in ${emp.position}`,
            deadline: new Date('2025-12-31'),
            progress: Math.floor(Math.random() * 80) + 10,
            status: ['In Progress', 'Completed', 'Pending'][Math.floor(Math.random() * 3)],
          }
        });
      }

      if (!await prisma.attendance.findFirst({ where: { employeeId: empId, checkInTime: new Date('2025-06-26T09:00:00') } })) {
        await prisma.attendance.create({
          data: {
            employeeId: empId,
            checkInTime: new Date('2025-06-26T09:00:00'),
            checkOutTime: new Date('2025-06-26T17:00:00'),
          }
        });
      }

      if (!await prisma.recruitment.findFirst({ where: { employeeId: empId, date: new Date('2025-05-01') } })) {
        await prisma.recruitment.create({
          data: {
            employeeId: empId,
            type: 'Internal',
            date: new Date('2025-05-01'),
            status: 'Completed'
          }
        });
      }

      if (!await prisma.salary.findFirst({ where: { employeeId: empId, payDate: new Date('2025-06-25') } })) {
        await prisma.salary.create({
          data: {
            employeeId: empId,
            baseSalary: emp.salary,
            allowances: 3000,
            deductions: Math.floor(emp.salary * 0.2),
            payDate: new Date('2025-06-25'),
            overtimeHours: Math.floor(Math.random() * 20) + 5
          }
        });
      }

      if (!await prisma.performanceReview.findFirst({ where: { employeeId: empId, reviewDate: new Date('2025-06-20') } })) {
        await prisma.performanceReview.create({
          data: {
            employeeId: empId,
            rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
            feedback: `Performance review for ${emp.name}. Shows consistent improvement and dedication to work.`,
            reviewDate: new Date('2025-06-20'),
            reviewPeriod: 'Q2 2025',
            goals: `Continue professional development in ${emp.position}`
          }
        });
      }
    }

    // Create sample jobs if none exist (from document 6)
    const existingJobs = await prisma.job.count();
    if (existingJobs === 0) {
      const sampleJobs = [
        {
          title: 'Senior Frontend Developer',
          department: 'Engineering',
          description: 'We are looking for a skilled Frontend Developer to join our dynamic team.',
          requirements: ['React.js', 'TypeScript', 'CSS/SCSS'],
          salary: '$80,000 - $120,000',
          location: 'New York, NY',
          status: 'ACTIVE'
        },
        {
          title: 'UX/UI Designer',
          department: 'Design',
          description: 'Join our creative team as a UX/UI Designer.',
          requirements: ['Figma', 'Adobe Creative Suite'],
          salary: '$70,000 - $100,000',
          location: 'San Francisco, CA',
          status: 'ACTIVE'
        }
      ];

      for (const jobData of sampleJobs) {
        await prisma.job.create({ data: jobData });
      }
    }



    // Create HR System record if it doesn't exist
    if (!await prisma.hRSystem.findFirst()) {
      await prisma.hRSystem.create({
        data: { 
          status: 'Active',
          lastUpdated: new Date(),
          version: '2.0.0'
        }
      });
    }

    console.log('All models seeded conditionally with comprehensive data!');

    console.log(`Employees: ${(await prisma.employee.count())}`);
    console.log(`Goals: ${(await prisma.goal.count())}`);
    console.log(`Jobs: ${(await prisma.job.count())}`);
    console.log(`Salary records: ${(await prisma.salary.count())}`);
    console.log(`Performance reviews: ${(await prisma.performanceReview.count())}`);
    console.log(`Leave requests: ${(await prisma.leaveRequest.count())}`);
    console.log('');
    console.log('Default Login Credentials:');
    console.log('Admin: admin@hrcore.com / securepassword123');
    console.log('Team Lead: teamlead@hrcore.com / team123');
    console.log('Employee: employee@hrcore.com / employee123');
    console.log('Other Employees: [name]@hrcore.com / default123');

  } catch (error) {
    console.log('Database initialization failed:', error.message);
  }
}

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Reports API available at http://localhost:${PORT}/api/reports`);
  console.log(`Leave Management API available at http://localhost:${PORT}/api/leave`);
  console.log(`Jobs API with CV upload available at http://localhost:${PORT}/api/jobs`);
  console.log(`Candidates API with CV download available at http://localhost:${PORT}/api/candidates`);
  console.log(`Interviews API available at http://localhost:${PORT}/api/interviews`);
  console.log(`CV uploads stored in: ${uploadsDir}`);
  console.log(`Email service: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured'}`);
  console.log(`Report download endpoint: http://localhost:${PORT}/api/reports/:id/download/:format`);
  console.log(`\nLogin credentials:`);
  console.log(`   Admin: admin@hrcore.com / securepassword123`);
  console.log(`   Team Lead: teamlead@hrcore.com / team123`);
  console.log(`   Employee: employee@hrcore.com / employee123\n`);
  
  // Initialize database and test email
  initializeData();
  testEmailConfig();
});