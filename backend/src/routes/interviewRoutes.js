import express from 'express';
import { prisma } from '../../index.js';

const router = express.Router();

// Get all interviews (for admin dashboard)
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/interviews called');
    
    const interviews = await prisma.interview.findMany({
      include: {
        candidate: {
          select: { 
            id: true, 
            name: true, 
            email: true,
            applications: {
              include: {
                job: {
                  select: { title: true }
                }
              },
              orderBy: { appliedDate: 'desc' },
              take: 1
            }
          }
        }
      },
      orderBy: { date: 'asc' }
    });

    const formattedInterviews = interviews.map(interview => ({
      ...interview,
      date: interview.date.toLocaleDateString('en-GB'),
      type: interview.type.toLowerCase().replace('_', '-'),
      status: interview.status ? interview.status.toLowerCase() : 'scheduled',
      position: interview.candidate.applications[0]?.job.title || 'N/A'
    }));

    console.log('Found interviews:', formattedInterviews.length);
    res.json(formattedInterviews);

  } catch (error) {
    console.error('Get interviews error:', error);
    res.status(500).json({ message: 'Failed to fetch interviews', error: error.message });
  }
});

// Schedule a new interview
router.post('/', async (req, res) => {
  try {
    console.log('INTERVIEW REQUEST RECEIVED:', req.body);
    
    const { 
      candidateId, 
      candidateName,
      position,
      date, 
      time, 
      duration, 
      type, 
      interviewer, 
      location, 
      notes
    } = req.body;

    if (!candidateId || !date || !time || !type || !interviewer) {
      console.log('Missing required fields:', { candidateId, date, time, type, interviewer });
      return res.status(400).json({ 
        message: 'candidateId, date, time, type, and interviewer are required' 
      });
    }

    // Convert type to match database enum: 'in-person' -> 'IN_PERSON'
    const interviewType = type.toUpperCase().replace('-', '_');
    console.log('Converted type:', type, '->', interviewType);

    // Validate interview type against enum
    const validTypes = ['PHONE', 'VIDEO', 'IN_PERSON', 'TECHNICAL', 'HR'];
    if (!validTypes.includes(interviewType)) {
      console.log('Invalid interview type:', interviewType);
      return res.status(400).json({ 
        message: `Invalid interview type. Must be one of: ${validTypes.join(', ')}` 
      });
    }

    // Check if candidate exists
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId }
    });

    if (!candidate) {
      console.log('Candidate not found:', candidateId);
      return res.status(404).json({ message: 'Candidate not found' });
    }

    console.log('Found candidate:', candidate.name);

    // Create interview
    const interview = await prisma.interview.create({
      data: {
        candidateId,
        title: `Interview - ${candidateName}`,
        description: `${interviewType} interview for ${position} position`,
        type: interviewType,
        date: new Date(date),
        time,
        duration: String(duration || 60),
        location: location || '',
        interviewer,
        notes: notes || '',
        status: 'SCHEDULED'
      }
    });

    console.log('Interview created:', interview.id);

    // Update candidate application status based on interview type
    const latestApplication = await prisma.application.findFirst({
      where: { candidateId },
      orderBy: { appliedDate: 'desc' }
    });

    if (latestApplication) {
      let newStatus = latestApplication.status;
      
      if (latestApplication.status === 'NEW' && (interviewType === 'PHONE' || interviewType === 'VIDEO')) {
        newStatus = 'SCREENING';
      } else if (latestApplication.status === 'SCREENING') {
        newStatus = 'INTERVIEW';
      }

      if (newStatus !== latestApplication.status) {
        await prisma.application.update({
          where: { id: latestApplication.id },
          data: { status: newStatus }
        });
        console.log(`Updated candidate status: ${latestApplication.status} -> ${newStatus}`);
      }
    }

    // Format response to match frontend expectations
    const formattedInterview = {
      ...interview,
      date: interview.date.toLocaleDateString('en-GB'),
      type: interview.type.toLowerCase().replace('_', '-'),
      status: interview.status.toLowerCase()
    };

    console.log('Sending response:', formattedInterview);
    res.status(201).json(formattedInterview);

  } catch (error) {
    console.error('Schedule interview error:', error);
    res.status(500).json({ 
      message: 'Failed to schedule interview', 
      error: error.message 
    });
  }
});

// Get interview by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const interview = await prisma.interview.findUnique({
      where: { id },
      include: {
        candidate: {
          select: { 
            id: true, 
            name: true, 
            email: true,
            applications: {
              include: {
                job: {
                  select: { title: true }
                }
              },
              orderBy: { appliedDate: 'desc' },
              take: 1
            }
          }
        }
      }
    });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    const formattedInterview = {
      ...interview,
      date: interview.date.toLocaleDateString('en-GB'),
      type: interview.type.toLowerCase().replace('_', '-'),
      status: interview.status ? interview.status.toLowerCase() : 'scheduled',
      position: interview.candidate.applications[0]?.job.title || 'N/A'
    };

    res.json(formattedInterview);

  } catch (error) {
    console.error('Get interview error:', error);
    res.status(500).json({ message: 'Failed to fetch interview', error: error.message });
  }
});

// Update interview
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existingInterview = await prisma.interview.findUnique({ where: { id } });
    if (!existingInterview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Handle date conversion if provided
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    // Handle type conversion if provided
    if (updateData.type) {
      updateData.type = updateData.type.toUpperCase().replace('-', '_');
    }

    const interview = await prisma.interview.update({
      where: { id },
      data: updateData,
      include: {
        candidate: {
          select: { 
            id: true, 
            name: true, 
            email: true,
            applications: {
              include: {
                job: {
                  select: { title: true }
                }
              },
              orderBy: { appliedDate: 'desc' },
              take: 1
            }
          }
        }
      }
    });

    const formattedInterview = {
      ...interview,
      date: interview.date.toLocaleDateString('en-GB'),
      type: interview.type.toLowerCase().replace('_', '-'),
      status: interview.status ? interview.status.toLowerCase() : 'scheduled',
      position: interview.candidate.applications[0]?.job.title || 'N/A'
    };

    res.json(formattedInterview);

  } catch (error) {
    console.error('Update interview error:', error);
    res.status(500).json({ message: 'Failed to update interview', error: error.message });
  }
});

// Delete interview
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingInterview = await prisma.interview.findUnique({ where: { id } });
    if (!existingInterview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    await prisma.interview.delete({ where: { id } });
    
    res.json({ message: 'Interview deleted successfully' });
    
  } catch (error) {
    console.error('Delete interview error:', error);
    res.status(500).json({ message: 'Failed to delete interview', error: error.message });
  }
});

export default router;