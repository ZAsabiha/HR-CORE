import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CandidateController {
  // Get all candidates
  async getAllCandidates(req, res) {
    try {
      const { status, position, search, sortBy = 'createdAt', order = 'desc' } = req.query;
      
      let where = {};
      
      // Apply search filter
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      // Define sorting
      let orderBy = {};
      switch (sortBy) {
        case 'name':
          orderBy.name = order;
          break;
        case 'rating':
          orderBy.rating = order;
          break;
        default:
          orderBy.createdAt = order;
      }
      
      const candidates = await prisma.candidate.findMany({
        where,
        orderBy,
        include: {
          applications: {
            include: {
              job: {
                select: {
                  id: true,
                  title: true
                }
              }
            },
            orderBy: { appliedDate: 'desc' }
          },
          interviews: {
            orderBy: { date: 'desc' },
            take: 5
          }
        }
      });
      
      // Format candidates to match frontend expectations
      let formattedCandidates = candidates.map(candidate => {
        const latestApplication = candidate.applications[0];
        const applicationStatus = latestApplication ? latestApplication.status : 'NEW';
        
        return {
          ...candidate,
          skills: candidate.skills || [],
          position: latestApplication ? latestApplication.job.title : 'N/A',
          status: applicationStatus.charAt(0) + applicationStatus.slice(1).toLowerCase(),
          appliedDate: latestApplication 
            ? latestApplication.appliedDate.toLocaleDateString('en-GB')
            : candidate.createdAt.toLocaleDateString('en-GB'),
          rating: candidate.rating || 0,
          applications: candidate.applications.map(app => ({
            ...app,
            appliedDate: app.appliedDate.toLocaleDateString('en-GB'),
            status: app.status.charAt(0) + app.status.slice(1).toLowerCase()
          }))
        };
      });
      
      // Apply status filter (after formatting)
      if (status && status !== 'all') {
        formattedCandidates = formattedCandidates.filter(
          candidate => candidate.status.toLowerCase() === status.toLowerCase()
        );
      }
      
      // Apply position filter
      if (position && position !== 'all') {
        formattedCandidates = formattedCandidates.filter(
          candidate => candidate.position === position
        );
      }
      
      res.json(formattedCandidates);
    } catch (error) {
      console.error('Get candidates error:', error);
      res.status(500).json({ message: 'Failed to fetch candidates', error: error.message });
    }
  }
  
  // Get single candidate
  async getCandidateById(req, res) {
    try {
      const { id } = req.params;
      
      const candidate = await prisma.candidate.findUnique({
        where: { id },
        include: {
          applications: {
            include: {
              job: true
            },
            orderBy: { appliedDate: 'desc' }
          },
          interviews: {
            orderBy: { date: 'desc' }
          }
        }
      });
      
      if (!candidate) {
        return res.status(404).json({ message: 'Candidate not found' });
      }
      
      const formattedCandidate = {
        ...candidate,
        skills: candidate.skills || [],
        applications: candidate.applications.map(app => ({
          ...app,
          appliedDate: app.appliedDate.toLocaleDateString('en-GB'),
          status: app.status.charAt(0) + app.status.slice(1).toLowerCase()
        })),
        interviews: candidate.interviews.map(interview => ({
          ...interview,
          date: interview.date.toLocaleDateString('en-GB'),
          type: interview.type.charAt(0) + interview.type.slice(1).toLowerCase(),
          status: interview.status.charAt(0) + interview.status.slice(1).toLowerCase()
        }))
      };
      
      res.json(formattedCandidate);
    } catch (error) {
      console.error('Get candidate by ID error:', error);
      res.status(500).json({ message: 'Failed to fetch candidate', error: error.message });
    }
  }
  
  // Update candidate status
  async updateCandidateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }
      
      // Update the candidate's latest application status
      const candidate = await prisma.candidate.findUnique({
        where: { id },
        include: {
          applications: {
            orderBy: { appliedDate: 'desc' },
            take: 1
          }
        }
      });
      
      if (!candidate) {
        return res.status(404).json({ message: 'Candidate not found' });
      }
      
      if (candidate.applications.length > 0) {
        const latestApplication = candidate.applications[0];
        await prisma.application.update({
          where: { id: latestApplication.id },
          data: { status: status.toUpperCase() }
        });
      }
      
      res.json({ message: 'Status updated successfully' });
      
    } catch (error) {
      console.error('Update candidate status error:', error);
      res.status(500).json({ message: 'Failed to update status', error: error.message });
    }
  }

  
  
  // Download candidate CV
  async downloadCV(req, res) {
    try {
      const { id } = req.params;
      
      const candidate = await prisma.candidate.findUnique({
        where: { id },
        select: { cvPath: true, cvOriginalName: true, name: true }
      });
      
      if (!candidate || !candidate.cvPath) {
        return res.status(404).json({ message: 'CV not found' });
      }
      
      const filePath = path.resolve(candidate.cvPath);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'CV file not found on server' });
      }
      
      // Set appropriate headers
      const originalName = candidate.cvOriginalName || `${candidate.name}_CV.pdf`;
      res.setHeader('Content-Disposition', `attachment; filename="${originalName}"`);
      res.setHeader('Content-Type', 'application/octet-stream');
      
      // Send file
      res.sendFile(filePath);
      
    } catch (error) {
      console.error('Download CV error:', error);
      res.status(500).json({ message: 'Failed to download CV', error: error.message });
    }
  }
  
  // Schedule interview
  async scheduleInterview(req, res) {
    try {
      const { candidateId } = req.params;
      const { title, description, type, date, time, duration, location, interviewer, notes } = req.body;
      
      // Validate required fields
      if (!title || !type || !date || !time) {
        return res.status(400).json({ 
          message: 'Title, type, date, and time are required' 
        });
      }
      
      // Check if candidate exists
      const candidate = await prisma.candidate.findUnique({
        where: { id: candidateId }
      });
      
      if (!candidate) {
        return res.status(404).json({ message: 'Candidate not found' });
      }
      
      // Create interview
      const interview = await prisma.interview.create({
        data: {
          candidateId,
          title,
          description,
          type: type.toUpperCase(),
          date: new Date(date),
          time,
          duration,
          location,
          interviewer,
          notes
        }
      });
      
      // Update candidate application status based on interview type
      const latestApplication = await prisma.application.findFirst({
        where: { candidateId },
        orderBy: { appliedDate: 'desc' }
      });
      
      if (latestApplication) {
        let newStatus = latestApplication.status;
        
        if (latestApplication.status === 'NEW' && (type === 'PHONE' || type === 'VIDEO')) {
          newStatus = 'SCREENING';
        } else if (latestApplication.status === 'SCREENING') {
          newStatus = 'INTERVIEW';
        }
        
        if (newStatus !== latestApplication.status) {
          await prisma.application.update({
            where: { id: latestApplication.id },
            data: { status: newStatus }
          });
        }
      }
      
      const formattedInterview = {
        ...interview,
        date: interview.date.toLocaleDateString('en-GB'),
        type: interview.type.charAt(0) + interview.type.slice(1).toLowerCase(),
        status: interview.status.charAt(0) + interview.status.slice(1).toLowerCase()
      };
      
      res.status(201).json(formattedInterview);
    } catch (error) {
      console.error('Schedule interview error:', error);
      res.status(500).json({ message: 'Failed to schedule interview', error: error.message });
    }
  }
}

export default new CandidateController();