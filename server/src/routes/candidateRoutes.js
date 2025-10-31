import express from 'express';
import path from 'path';
import fs from 'fs';
import { prisma, createEmailTransporter } from '../../index.js';

const router = express.Router();

// Get all candidates
router.get('/', async (req, res) => {
  try {
    const candidates = await prisma.candidate.findMany({
      include: {
        applications: {
          include: {
            job: {
              select: { id: true, title: true }
            }
          },
          orderBy: { appliedDate: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedCandidates = candidates.map(candidate => {
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
        hasCV: !!candidate.cvPath,
        cvOriginalName: candidate.cvOriginalName,
        applications: candidate.applications.map(app => ({
          ...app,
          appliedDate: app.appliedDate.toLocaleDateString('en-GB'),
          status: app.status.charAt(0) + app.status.slice(1).toLowerCase()
        }))
      };
    });

    res.json(formattedCandidates);
  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({ message: 'Failed to fetch candidates', error: error.message });
  }
});

// Get candidate by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        applications: {
          include: {
            job: {
              select: { id: true, title: true }
            }
          },
          orderBy: { appliedDate: 'desc' }
        }
      }
    });

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.json(candidate);
  } catch (error) {
    console.error('Get candidate error:', error);
    res.status(500).json({ message: 'Failed to fetch candidate', error: error.message });
  }
});

// Update candidate status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

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
});

// Download CV
router.get('/:id/cv/download', async (req, res) => {
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
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'CV file not found on server' });
    }
    
    const originalName = candidate.cvOriginalName || `${candidate.name}_CV.pdf`;
    res.setHeader('Content-Disposition', `attachment; filename="${originalName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    res.sendFile(filePath);
    
  } catch (error) {
    console.error('Download CV error:', error);
    res.status(500).json({ message: 'Failed to download CV', error: error.message });
  }
});

// Get interviews for a specific candidate
router.get('/:id/interviews', async (req, res) => {
  try {
    const { id: candidateId } = req.params;
    
    const interviews = await prisma.interview.findMany({
      where: { candidateId },
      orderBy: { date: 'desc' },
      include: {
        candidate: {
          select: { name: true }
        }
      }
    });

    const formattedInterviews = interviews.map(interview => ({
      ...interview,
      date: interview.date.toLocaleDateString('en-GB'),
      type: interview.type.toLowerCase().replace('_', '-'),
      status: interview.status ? interview.status.toLowerCase() : 'scheduled'
    }));

    res.json(formattedInterviews);

  } catch (error) {
    console.error('Get candidate interviews error:', error);
    res.status(500).json({ message: 'Failed to fetch interviews', error: error.message });
  }
});

// Send email to candidate - THE FIXED EMAIL ENDPOINT
router.post('/:id/contact', async (req, res) => {
  console.log('EMAIL ENDPOINT REACHED - candidateRoutes.js');
  console.log('Request params:', req.params);
  console.log('Request body:', req.body);
  console.log('Session user:', req.session?.user || 'No session');
  
  try {
    const { id: candidateId } = req.params;
    const { subject, message, template } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: {
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
    });

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    if (!candidate.email) {
      return res.status(400).json({ message: 'Candidate email not found' });
    }

    console.log('Attempting to send email to:', candidate.email);

    // Create email transporter
    const transporter = createEmailTransporter();

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: candidate.email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0C3D4A; color: white; padding: 20px; text-align: center;">
            <h1>HR Core</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa;">
            <h2>Hello ${candidate.name},</h2>
            <div style="white-space: pre-line; line-height: 1.6; color: #333;">
              ${message}
            </div>
          </div>
          <div style="background: #e9ecef; padding: 20px; text-align: center; color: #666; font-size: 14px;">
            <p>This email was sent from HR Core recruitment system.</p>
          </div>
        </div>
      `
    };

    // Send email
    console.log('Sending email with options:', { 
      from: mailOptions.from, 
      to: mailOptions.to, 
      subject: mailOptions.subject 
    });
    
    await transporter.sendMail(mailOptions);

    console.log(`Email sent successfully to ${candidate.email}`);

    res.json({ 
      message: 'Email sent successfully',
      sentTo: candidate.email
    });

  } catch (error) {
    console.error('Email sending error:', error);
    
    if (error.code === 'EAUTH') {
      return res.status(500).json({ 
        message: 'Email authentication failed. Please check email credentials.' 
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to send email', 
      error: error.message 
    });
  }
});

// to get better debugging info

router.post('/:id/contact', async (req, res) => {
  console.log('EMAIL ENDPOINT REACHED - candidateRoutes.js');
  console.log('Request params:', req.params);
  console.log('Request body:', req.body);
  
  // CHECK ENVIRONMENT VARIABLES
  console.log('Environment check:');
  console.log('EMAIL_USER:', process.env.EMAIL_USER || 'MISSING');
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET (length: ' + process.env.EMAIL_PASS.length + ')' : 'MISSING');
  
  try {
    const { id: candidateId } = req.params;
    const { subject, message, template } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: {
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
    });

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    if (!candidate.email) {
      return res.status(400).json({ message: 'Candidate email not found' });
    }

    console.log('Attempting to send email to:', candidate.email);

    // Create email transporter
    const transporter = createEmailTransporter();

    // TEST CONNECTION FIRST
    console.log('Testing SMTP connection...');
    try {
      await transporter.verify();
      console.log(' SMTP connection verified successfully');
    } catch (verifyError) {
      console.error(' SMTP connection failed:', verifyError);
      return res.status(500).json({ 
        message: 'Email service connection failed',
        error: verifyError.message 
      });
    }

    // Email options
    const mailOptions = {
      from: `"HR Core" <${process.env.EMAIL_USER}>`,
      to: candidate.email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0C3D4A; color: white; padding: 20px; text-align: center;">
            <h1>HR Core</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa;">
            <h2>Hello ${candidate.name},</h2>
            <div style="white-space: pre-line; line-height: 1.6; color: #333;">
              ${message}
            </div>
          </div>
          <div style="background: #e9ecef; padding: 20px; text-align: center; color: #666; font-size: 14px;">
            <p>This email was sent from HR Core recruitment system.</p>
          </div>
        </div>
      `,
      text: `Hello ${candidate.name},\n\n${message}\n\nThis email was sent from HR Core recruitment system.`
    };

    // Send email with detailed logging
    console.log('Sending email with options:', { 
      from: mailOptions.from, 
      to: mailOptions.to, 
      subject: mailOptions.subject 
    });
    
    const info = await transporter.sendMail(mailOptions);

    // LOG DETAILED SUCCESS INFO
    console.log(' Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    console.log('Accepted:', info.accepted);
    console.log('Rejected:', info.rejected);
    console.log('Pending:', info.pending);
    console.log('Envelope:', info.envelope);

    res.json({ 
      message: 'Email sent successfully',
      sentTo: candidate.email,
      messageId: info.messageId,
      response: info.response
    });

  } catch (error) {
    console.error(' Email sending error:', error);
    console.error('Error code:', error.code);
    console.error('Error response:', error.response);
    console.error('Error responseCode:', error.responseCode);
    
    if (error.code === 'EAUTH') {
      return res.status(500).json({ 
        message: 'Gmail authentication failed. Please regenerate your App Password.' 
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to send email', 
      error: error.message,
      code: error.code
    });
  }
});

export default router;