import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal'; 

const ContactCandidateModal = ({ candidate, isOpen, onClose }) => {
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    message: '',
    template: 'custom'
  });

  // Update email data when candidate changes
  useEffect(() => {
    if (candidate) {
      setEmailData(prev => ({
        ...prev,
        to: candidate.email
      }));
    }
  }, [candidate]);

  const emailTemplates = {
    interview_invite: {
      subject: 'Interview Invitation - {{position}}',
      message: `Dear {{name}},

Thank you for your interest in the {{position}} position at our company. We were impressed with your application and would like to invite you for an interview.

Please let us know your availability for the upcoming week, and we'll schedule a convenient time.

Best regards,
HR Team`
    },
    status_update: {
      subject: 'Application Status Update - {{position}}',
      message: `Dear {{name}},

We wanted to provide you with an update on your application for the {{position}} position.

We are currently reviewing applications and will be in touch soon with next steps.

Thank you for your patience.

Best regards,
HR Team`
    },
    rejection: {
      subject: 'Application Update - {{position}}',
      message: `Dear {{name}},

Thank you for your interest in the {{position}} position and for taking the time to apply.

After careful consideration, we have decided to move forward with other candidates whose experience more closely matches our current needs.

We appreciate your interest in our company and encourage you to apply for future opportunities that align with your skills and experience.

Best regards,
HR Team`
    },
    offer: {
      subject: 'Job Offer - {{position}}',
      message: `Dear {{name}},

We are delighted to offer you the position of {{position}} at our company.

We were impressed by your qualifications and believe you will be a valuable addition to our team.

Please review the attached offer details and let us know your decision by [DATE].

Congratulations and welcome to the team!

Best regards,
HR Team`
    }
  };

  const applyTemplate = (templateKey) => {
    if (templateKey === 'custom') {
      setEmailData(prev => ({ 
        ...prev, 
        subject: '', 
        message: '', 
        template: 'custom' 
      }));
      return;
    }

    const template = emailTemplates[templateKey];
    const subject = template.subject
      .replace('{{position}}', candidate?.position || '')
      .replace('{{name}}', candidate?.name || '');
    
    const message = template.message
      .replace(/{{name}}/g, candidate?.name || '')
      .replace(/{{position}}/g, candidate?.position || '');

    setEmailData(prev => ({
      ...prev,
      subject,
      message,
      template: templateKey
    }));
  };

  const sendEmail = () => {
    // Here you would integrate with your email service
    console.log('Sending email:', emailData);
    alert('Email sent successfully!');
    onClose();
  };

  if (!candidate) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Contact Candidate" size="large">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }}>
        {/* Main Email Form */}
        <div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500', 
              color: '#333' 
            }}>
              To
            </label>
            <input
              type="email"
              value={emailData.to}
              onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                backgroundColor: '#f8f9fa'
              }}
              readOnly
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500', 
              color: '#333' 
            }}>
              Subject
            </label>
            <input
              type="text"
              value={emailData.subject}
              onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="Enter email subject"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500', 
              color: '#333' 
            }}>
              Message
            </label>
            <textarea
              value={emailData.message}
              onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
              style={{
                width: '100%',
                height: '300px',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                resize: 'vertical',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                lineHeight: '1.5'
              }}
              placeholder="Enter your message..."
            />
          </div>
        </div>

        {/* Template Sidebar */}
        <div>
          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '12px'
          }}>
            <h4 style={{ 
              marginBottom: '16px', 
              fontSize: '16px', 
              color: '#0C3D4A' 
            }}>
              Email Templates
            </h4>
            
            <div style={{ marginBottom: '16px' }}>
              <button
                onClick={() => applyTemplate('interview_invite')}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: emailData.template === 'interview_invite' ? '#0C3D4A' : 'white',
                  color: emailData.template === 'interview_invite' ? 'white' : '#333',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: '8px',
                  fontSize: '14px',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                📅 Interview Invitation
              </button>
              
              <button
                onClick={() => applyTemplate('status_update')}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: emailData.template === 'status_update' ? '#0C3D4A' : 'white',
                  color: emailData.template === 'status_update' ? 'white' : '#333',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: '8px',
                  fontSize: '14px',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                📋 Status Update
              </button>
              
              <button
                onClick={() => applyTemplate('offer')}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: emailData.template === 'offer' ? '#0C3D4A' : 'white',
                  color: emailData.template === 'offer' ? 'white' : '#333',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: '8px',
                  fontSize: '14px',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                🎉 Job Offer
              </button>
              
              <button
                onClick={() => applyTemplate('rejection')}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: emailData.template === 'rejection' ? '#0C3D4A' : 'white',
                  color: emailData.template === 'rejection' ? 'white' : '#333',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: '8px',
                  fontSize: '14px',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                ❌ Rejection Letter
              </button>
              
              <button
                onClick={() => applyTemplate('custom')}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: emailData.template === 'custom' ? '#0C3D4A' : 'white',
                  color: emailData.template === 'custom' ? 'white' : '#333',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                ✏️ Custom Message
              </button>
            </div>

            <div style={{ marginTop: '24px' }}>
              <h5 style={{ 
                marginBottom: '12px', 
                fontSize: '14px', 
                color: '#666' 
              }}>
                Candidate Info
              </h5>
              <div style={{ 
                fontSize: '13px', 
                color: '#666', 
                lineHeight: '1.5',
                background: 'white',
                padding: '12px',
                borderRadius: '8px'
              }}>
                <div><strong>Name:</strong> {candidate.name}</div>
                <div><strong>Position:</strong> {candidate.position}</div>
                <div><strong>Status:</strong> {candidate.status}</div>
                <div><strong>Applied:</strong> {candidate.appliedDate}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end',
        marginTop: '32px',
        paddingTop: '24px',
        borderTop: '1px solid #f0f0f0'
      }}>
        <button
          onClick={onClose}
          style={{
            padding: '12px 24px',
            background: 'white',
            color: '#666',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Cancel
        </button>
        <button
          style={{
            padding: '12px 24px',
            background: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          📎 Attach Files
        </button>
        <button
          onClick={sendEmail}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #0C3D4A, #1a4f5e)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          📤 Send Email
        </button>
      </div>
    </Modal>
  );
};

export default ContactCandidateModal;