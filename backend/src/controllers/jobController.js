import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class JobController {
  // Get all jobs
  async getAllJobs(req, res) {
    try {
      const { status, search, sortBy = 'postedDate', order = 'desc' } = req.query;
      
      let where = {};
      
      // Apply filters
      if (status && status !== 'all') {
        where.status = status.toUpperCase();
      }
      
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { department: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      // Define sorting
      let orderBy = {};
      switch (sortBy) {
        case 'title':
          orderBy.title = order;
          break;
        case 'applicants':
          orderBy.applicants = order;
          break;
        case 'department':
          orderBy.department = order;
          break;
        default:
          orderBy.postedDate = order;
      }
      
      const jobs = await prisma.job.findMany({
        where,
        orderBy,
        include: {
          _count: {
            select: { applications: true }
          }
        }
      });
      
      // Format response to match frontend expectations
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
  }
  
  // Get single job
  async getJobById(req, res) {
    try {
      const { id } = req.params;
      
      const job = await prisma.job.findUnique({
        where: { id },
        include: {
          applications: {
            include: {
              candidate: true
            },
            orderBy: { appliedDate: 'desc' }
          },
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
      console.error('Get job by ID error:', error);
      res.status(500).json({ message: 'Failed to fetch job', error: error.message });
    }
  }
  
  // Create new job
  async createJob(req, res) {
    try {
      const { title, department, description, requirements, salary, location } = req.body;
      
      if (!title || !department || !location) {
        return res.status(400).json({ 
          message: 'Title, department, and location are required' 
        });
      }
      
      const job = await prisma.job.create({
        data: {
          title,
          department,
          description,
          requirements: requirements || [],
          salary,
          location,
          status: 'ACTIVE'
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
  }
  
  // Update job
  async updateJob(req, res) {
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
      if (description) updateData.description = description;
      if (requirements) updateData.requirements = requirements;
      if (salary) updateData.salary = salary;
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
  }
  
  // Delete job
  async deleteJob(req, res) {
    try {
      const { id } = req.params;
      
      const existingJob = await prisma.job.findUnique({ where: { id } });
      if (!existingJob) {
        return res.status(404).json({ message: 'Job not found' });
      }
      
      // Delete related applications first
      await prisma.application.deleteMany({
        where: { jobId: id }
      });
      
      // Delete the job
      await prisma.job.delete({
        where: { id }
      });
      
      res.json({ message: 'Job deleted successfully' });
    } catch (error) {
      console.error('Delete job error:', error);
      res.status(500).json({ message: 'Failed to delete job', error: error.message });
    }
  }
  
  // Apply for a job (with CV upload)
  async applyForJob(req, res) {
    try {
      const { id: jobId } = req.params;
      const { name, email, phone, experience, skills, coverLetter, source = 'Website' } = req.body;
      const cvFile = req.file;
      
      // Validate required fields
      if (!name || !email) {
        return res.status(400).json({ 
          message: 'Name and email are required' 
        });
      }
      
      // Check if job exists and is active
      const job = await prisma.job.findUnique({ where: { id: jobId } });
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      
      if (job.status !== 'ACTIVE') {
        return res.status(400).json({ message: 'This job is no longer accepting applications' });
      }
      
      // Check if candidate already exists
      let candidate = await prisma.candidate.findUnique({
        where: { email }
      });
      
      if (candidate) {
        // Update existing candidate
        const updateData = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (experience) updateData.experience = experience;
        if (skills) updateData.skills = skills.split(',').map(s => s.trim());
        if (cvFile) {
          updateData.cvPath = cvFile.path;
          updateData.cvOriginalName = cvFile.originalname;
        }
        
        candidate = await prisma.candidate.update({
          where: { id: candidate.id },
          data: updateData
        });
      } else {
        // Create new candidate
        candidate = await prisma.candidate.create({
          data: {
            name,
            email,
            phone,
            experience,
            skills: skills ? skills.split(',').map(s => s.trim()) : [],
            source,
            cvPath: cvFile ? cvFile.path : null,
            cvOriginalName: cvFile ? cvFile.originalname : null
          }
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
        return res.status(400).json({ 
          message: 'You have already applied for this job' 
        });
      }
      
      // Create application
      const application = await prisma.application.create({
        data: {
          candidateId: candidate.id,
          jobId: jobId,
          coverLetter,
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
  }
  
  // Get applications for a job
  async getJobApplications(req, res) {
    try {
      const { id } = req.params;
      
      const applications = await prisma.application.findMany({
        where: { jobId: id },
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
  }
}

export default new JobController();