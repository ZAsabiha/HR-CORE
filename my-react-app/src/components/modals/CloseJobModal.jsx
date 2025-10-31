import React, { useState } from 'react';
import Modal from '../common/Modal'; // Adjust path as needed

const CloseJobModal = ({ job, isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [sendNotification, setSendNotification] = useState(true);
  const [customReason, setCustomReason] = useState('');

  const predefinedReasons = [
    'Position filled',
    'Budget constraints',
    'Requirements changed',
    'Hiring freeze',
    'Internal candidate selected',
    'Role no longer needed',
    'Other'
  ];

  const handleConfirm = () => {
    const closeData = {
      jobId: job.id,
      reason: reason === 'Other' ? customReason : reason,
      sendNotification,
      closedDate: new Date().toLocaleDateString('en-GB'),
      closedBy: 'HR Manager' // This would come from user context
    };
    
    onConfirm(closeData);
    
    // Reset form
    setReason('');
    setCustomReason('');
    setSendNotification(true);
    
    onClose();
  };

  if (!job) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Close Job Posting" size="medium">
      {/* Warning Message */}
      <div style={{
        background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)',
        border: '1px solid #fbbf24',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{ fontSize: '24px' }}>⚠️</div>
        <div>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#92400e', fontWeight: '600' }}>
            Confirm Job Closure
          </h4>
          <p style={{ margin: '0', fontSize: '14px', color: '#92400e', lineHeight: '1.4' }}>
            This action will close the job posting and stop accepting new applications. 
            Existing applications will remain accessible.
          </p>
        </div>
      </div>

      {/* Job Information */}
      <div style={{
        background: '#f8f9fa',
        padding: '16px 20px',
        borderRadius: '12px',
        marginBottom: '24px'
      }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#0C3D4A' }}>
          Job to be closed:
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            background: 'linear-gradient(135deg, #0C3D4A, #1a4f5e)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px'
          }}>
            💼
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
              {job.title}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {job.department} • {job.location} • {job.applicants} applications
            </div>
          </div>
        </div>
      </div>

      {/* Closure Reason */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontWeight: '500', 
          color: '#333' 
        }}>
          Reason for closing *
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '14px',
            boxSizing: 'border-box',
            marginBottom: '12px'
          }}
        >
          <option value="">Select a reason</option>
          {predefinedReasons.map((reasonOption) => (
            <option key={reasonOption} value={reasonOption}>
              {reasonOption}
            </option>
          ))}
        </select>

        {reason === 'Other' && (
          <input
            type="text"
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            placeholder="Please specify the reason"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        )}
      </div>

      {/* Notification Options */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          cursor: 'pointer',
          padding: '12px',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          background: sendNotification ? '#f0f9ff' : 'white'
        }}>
          <input
            type="checkbox"
            checked={sendNotification}
            onChange={(e) => setSendNotification(e.target.checked)}
            style={{ width: '16px', height: '16px' }}
          />
          <div>
            <div style={{ fontWeight: '500', color: '#333' }}>
              Notify candidates
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              Send closure notification to candidates with active applications
            </div>
          </div>
        </label>
      </div>

      {/* Impact Summary */}
      <div style={{
        background: '#f8f9fa',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '24px'
      }}>
        <h5 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#0C3D4A', fontWeight: '600' }}>
          What happens when you close this job:
        </h5>
        <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '13px', color: '#666', lineHeight: '1.6' }}>
          <li>Job posting will be removed from public view</li>
          <li>No new applications will be accepted</li>
          <li>Existing applications remain accessible for review</li>
          <li>Job status will be changed to "Closed"</li>
          {sendNotification && <li>Active candidates will receive a closure notification</li>}
        </ul>
      </div>

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
            fontWeight: '500'
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={!reason || (reason === 'Other' && !customReason.trim())}
          style={{
            padding: '12px 24px',
            background: (!reason || (reason === 'Other' && !customReason.trim())) 
              ? '#cccccc' 
              : 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: (!reason || (reason === 'Other' && !customReason.trim())) 
              ? 'not-allowed' 
              : 'pointer',
            fontWeight: '600',
            opacity: (!reason || (reason === 'Other' && !customReason.trim())) ? 0.6 : 1
          }}
        >
          ❌ Close Job Posting
        </button>
      </div>
    </Modal>
  );
};

export default CloseJobModal;