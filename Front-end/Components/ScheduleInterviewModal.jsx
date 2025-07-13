import React, { useState } from 'react';
import Modal from '../common/Modal'; 

const ScheduleInterviewModal = ({ candidate, isOpen, onClose, onSchedule }) => {
  const [interviewData, setInterviewData] = useState({
    date: '',
    time: '',
    duration: '60',
    type: 'video',
    interviewer: '',
    location: '',
    notes: '',
    round: '1'
  });

  const today = new Date().toISOString().split('T')[0];

  const handleInputChange = (field, value) => {
    setInterviewData(prev => ({ ...prev, [field]: value }));
  };

  const handleSchedule = () => {
    // Validation
    if (!interviewData.date || !interviewData.time || !interviewData.interviewer) {
      alert('Please fill in all required fields (Date, Time, and Interviewer)');
      return;
    }

    const interview = {
      ...interviewData,
      candidateId: candidate.id,
      candidateName: candidate.name,
      position: candidate.position,
      scheduledBy: 'HR Team', // You can make this dynamic
      createdAt: new Date().toISOString()
    };
    
    onSchedule(interview);
    alert('Interview scheduled successfully!');
    
    // Reset form
    setInterviewData({
      date: '',
      time: '',
      duration: '60',
      type: 'video',
      interviewer: '',
      location: '',
      notes: '',
      round: '1'
    });
    
    onClose();
  };

  if (!candidate) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Interview" size="medium">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left Column */}
        <div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500', 
              color: '#333' 
            }}>
              Interview Date *
            </label>
            <input
              type="date"
              value={interviewData.date}
              min={today}
              onChange={(e) => handleInputChange('date', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500', 
              color: '#333' 
            }}>
              Interview Time *
            </label>
            <input
              type="time"
              value={interviewData.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500', 
              color: '#333' 
            }}>
              Duration (minutes)
            </label>
            <select
              value={interviewData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
              <option value="120">2 hours</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500', 
              color: '#333' 
            }}>
              Interview Round
            </label>
            <select
              value={interviewData.round}
              onChange={(e) => handleInputChange('round', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              <option value="1">Round 1 - Initial Screening</option>
              <option value="2">Round 2 - Technical Interview</option>
              <option value="3">Round 3 - Final Interview</option>
              <option value="4">Round 4 - Leadership Interview</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500', 
              color: '#333' 
            }}>
              Interview Type
            </label>
            <select
              value={interviewData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              <option value="video">📹 Video Call</option>
              <option value="phone">📞 Phone Call</option>
              <option value="in-person">🏢 In-Person</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500', 
              color: '#333' 
            }}>
              Interviewer *
            </label>
            <input
              type="text"
              value={interviewData.interviewer}
              onChange={(e) => handleInputChange('interviewer', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="Enter interviewer name"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500', 
              color: '#333' 
            }}>
              {interviewData.type === 'video' ? 'Meeting Link' : 
               interviewData.type === 'phone' ? 'Phone Number' : 'Location'}
            </label>
            <input
              type="text"
              value={interviewData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder={
                interviewData.type === 'video' ? 'https://zoom.us/j/...' :
                interviewData.type === 'phone' ? '+1 (555) 123-4567' :
                'Office address or room number'
              }
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500', 
              color: '#333' 
            }}>
              Notes
            </label>
            <textarea
              value={interviewData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              style={{
                width: '100%',
                height: '80px',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                resize: 'vertical',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
              placeholder="Any additional notes or instructions..."
            />
          </div>
        </div>
      </div>

      {/* Candidate Info Summary */}
      <div style={{
        background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
        padding: '16px 20px',
        borderRadius: '12px',
        marginBottom: '24px',
        border: '1px solid #e2e8f0'
      }}>
        <h4 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '14px', 
          color: '#0C3D4A',
          fontWeight: '600'
        }}>
          📅 Interview for:
        </h4>
        <div style={{ 
          fontSize: '16px', 
          fontWeight: '600', 
          color: '#333',
          marginBottom: '4px'
        }}>
          {candidate.name} - {candidate.position}
        </div>
        <div style={{ 
          fontSize: '14px', 
          color: '#666'
        }}>
          Current Status: {candidate.status} • Applied: {candidate.appliedDate}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end',
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
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSchedule}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #0C3D4A, #1a4f5e)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
        >
          📅 Schedule Interview
        </button>
      </div>
    </Modal>
  );
};

export default ScheduleInterviewModal;