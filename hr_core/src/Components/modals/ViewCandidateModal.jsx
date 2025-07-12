import React from 'react';
import Modal from '../common/Modal'; // Adjust path as needed

const ViewCandidateModal = ({ candidate, isOpen, onClose }) => {
  if (!candidate) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Candidate Profile" size="large">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Left Column */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '32px',
            padding: '24px',
            background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
            borderRadius: '16px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #0C3D4A, #1a4f5e)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '28px',
              fontWeight: '700'
            }}>
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#0C3D4A' }}>
                {candidate.name}
              </h3>
              <p style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#666' }}>
                {candidate.position}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#f59e0b' }}>⭐</span>
                <span style={{ fontWeight: '600' }}>{candidate.rating}</span>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: candidate.status === 'New' ? '#fff3cd' : 
                            candidate.status === 'Screening' ? '#e7f3ff' :
                            candidate.status === 'Interview' ? '#f3e8ff' : '#d4edda',
                  color: candidate.status === 'New' ? '#856404' : 
                         candidate.status === 'Screening' ? '#0056b3' :
                         candidate.status === 'Interview' ? '#7c2d12' : '#155724'
                }}>
                  {candidate.status}
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '16px', fontSize: '18px', color: '#0C3D4A' }}>
              Contact Information
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '16px' }}>📧</span>
                <span style={{ fontWeight: '500' }}>{candidate.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '16px' }}>📱</span>
                <span style={{ fontWeight: '500' }}>{candidate.phone}</span>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '16px', fontSize: '18px', color: '#0C3D4A' }}>Skills</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {candidate.skills.map((skill, index) => (
                <span key={index} style={{
                  background: 'linear-gradient(135deg, #e0f7fa, #b2ebf2)',
                  color: '#0C3D4A',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '500'
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '16px', fontSize: '18px', color: '#0C3D4A' }}>
              Application Details
            </h4>
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>Applied Date:</span>
                  <span style={{ fontWeight: '500' }}>{candidate.appliedDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>Source:</span>
                  <span style={{ fontWeight: '500' }}>{candidate.source}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>Experience:</span>
                  <span style={{ fontWeight: '500' }}>{candidate.experience}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '16px', fontSize: '18px', color: '#0C3D4A' }}>
              Interview History
            </h4>
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px' }}>
              <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                No interviews scheduled yet
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '16px', fontSize: '18px', color: '#0C3D4A' }}>Notes</h4>
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px' }}>
              <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                No notes added yet
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
        <button style={{
          padding: '12px 24px',
          background: 'white',
          color: '#0C3D4A',
          border: '2px solid #0C3D4A',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600'
        }}>
          Edit Profile
        </button>
        <button style={{
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #0C3D4A, #1a4f5e)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600'
        }}>
          Schedule Interview
        </button>
      </div>
    </Modal>
  );
};

export default ViewCandidateModal;