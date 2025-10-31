import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { prisma } from '../../index.js';

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads/cvs';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for CV file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'cv-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype === 'application/pdf' ||
                   file.mimetype === 'application/msword' ||
                   file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    
    let whereClause = {};
    if (status && status !== 'all') {
      whereClause.status = status.toUpperCase();
    }
    
    const jobs = await prisma.job.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { postedDate: 'desc' }
    });

    const formattedJobs = jobs.map(job => ({
      ...job,
      applicants: job._count.applications,
      postedDate: job.postedDate.toLocaleDateString('en-GB'),
      requirements: job.requirements || [],
      status: job.status.charAt(0) + job.status.slice(1).toLowerCase()
    }));

    res.json(formattedJobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
  }
});

// Public jobs endpoint (only active jobs)
router.get('/public', async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { status: 'ACTIVE' },
      include: {
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { postedDate: 'desc' }
    });

    const formattedJobs = jobs.map(job => ({
      ...job,
      applicants: job._count.applications,
      postedDate: job.postedDate.toLocaleDateString('en-GB'),
      requirements: job.requirements || [],
      status: job.status.charAt(0) + job.status.slice(1).toLowerCase()
    }));

    res.json(formattedJobs);
  } catch (error) {
    console.error('Get public jobs error:', error);
    res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
  }
});

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const formattedJob = {
      ...job,
      applicants: job._count.applications,
      postedDate: job.postedDate.toLocaleDateString('en-GB'),
      requirements: job.requirements || [],
      status: job.status.charAt(0) + job.status.slice(1).toLowerCase()
    };

    res.json(formattedJob);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Failed to fetch job', error: error.message });
  }
});

// Create new job
router.post('/', async (req, res) => {
  try {
    const { title, department, description, requirements, salary, location, status } = req.body;
    
    if (!title || !department || !location) {
      return res.status(400).json({ 
        message: 'Title, department, and location are required' 
      });
    }
    
    const job = await prisma.job.create({
      data: {
        title,
        department,
        description: description || '',
        requirements: requirements || [],
        salary: salary || '',
        location,
        status: status || 'ACTIVE'
      }
    });
    
    const formattedJob = {
      ...job,
      postedDate: job.postedDate.toLocaleDateString('en-GB'),
      requirements: job.requirements || [],
      status: job.status.charAt(0) + job.status.slice(1).toLowerCase(),
      applicants: 0
    };
    
    res.status(201).json(formattedJob);
    
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Failed to create job', error: error.message });
  }
});

// Update job
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, department, description, requirements, salary, location, status } = req.body;
    
    const existingJob = await prisma.job.findUnique({ where: { id } });
    if (!existingJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    const updateData = {};
    if (title) updateData.title = title;
    if (department) updateData.department = department;
    if (description !== undefined) updateData.description = description;
    if (requirements !== undefined) updateData.requirements = requirements;
    if (salary !== undefined) updateData.salary = salary;
    if (location) updateData.location = location;
    if (status) updateData.status = status.toUpperCase();
    
    const job = await prisma.job.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { applications: true }
        }
      }
    });
    
    const formattedJob = {
      ...job,
      applicants: job._count.applications,
      postedDate: job.postedDate.toLocaleDateString('en-GB'),
      requirements: job.requirements || [],
      status: job.status.charAt(0) + job.status.slice(1).toLowerCase()
    };
    
    res.json(formattedJob);
    
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Failed to update job', error: error.message });
  }
});

// Delete job
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingJob = await prisma.job.findUnique({ where: { id } });
    if (!existingJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    await prisma.job.delete({ where: { id } });
    
    res.json({ message: 'Job deleted successfully' });
    
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Failed to delete job', error: error.message });
  }
});

// Get applications for a specific job
router.get('/:id/applications', async (req, res) => {
  try {
    const { id: jobId } = req.params;
    
    const applications = await prisma.application.findMany({
      where: { jobId },
      include: {
        candidate: true
      },
      orderBy: { appliedDate: 'desc' }
    });

    const formattedApplications = applications.map(app => ({
      ...app,
      appliedDate: app.appliedDate.toLocaleDateString('en-GB'),
      status: app.status.charAt(0) + app.status.slice(1).toLowerCase(),
      candidate: {
        ...app.candidate,
        skills: app.candidate.skills || []
      }
    }));

    res.json(formattedApplications);

  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
});

// Job application with CV upload
router.post('/:id/apply', upload.single('cv'), async (req, res) => {
  try {
    const { id: jobId } = req.params;
    const { name, email, phone, experience, skills, coverLetter } = req.body;
    const cvFile = req.file;
    
    console.log('Application received:', { name, email, cvFile: cvFile ? cvFile.filename : 'No CV' });
    
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Check if job exists
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if candidate exists
    let candidate = await prisma.candidate.findUnique({ where: { email } });
    
    if (!candidate) {
      candidate = await prisma.candidate.create({
        data: {
          name,
          email,
          phone: phone || '',
          experience: experience || '',
          skills: skills ? skills.split(',').map(s => s.trim()) : [],
          source: 'Website',
          cvPath: cvFile ? cvFile.path : null,
          cvOriginalName: cvFile ? cvFile.originalname : null
        }
      });
    } else {
      // Update existing candidate with new CV if provided
      const updateData = {
        name,
        phone: phone || candidate.phone,
        experience: experience || candidate.experience,
        skills: skills ? skills.split(',').map(s => s.trim()) : candidate.skills
      };
      
      if (cvFile) {
        updateData.cvPath = cvFile.path;
        updateData.cvOriginalName = cvFile.originalname;
      }
      
      candidate = await prisma.candidate.update({
        where: { id: candidate.id },
        data: updateData
      });
    }

    // Check if already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        candidateId_jobId: {
          candidateId: candidate.id,
          jobId: jobId
        }
      }
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        candidateId: candidate.id,
        jobId: jobId,
        coverLetter: coverLetter || '',
        status: 'NEW'
      }
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      applicationId: application.id
    });

  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({ message: 'Failed to submit application', error: error.message });
  }
});

export default router;