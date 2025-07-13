import React, { useState } from 'react';
import Modal from '../common/Modal'; 

const JobApplicationsModal = ({ job, isOpen, onClose }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Mock applications data for the job
  const applications = [
    {
      id: 1,
      candidateName: 'Raisa Raihan',
      email: 'prithwi@email.com',
      phone: '+8801824031787',
      appliedDate: '15/07/2024',
      status: 'New',
      rating: 4.5,
      source: 'LinkedIn',
      experience: '5+ years'
    },
    {
      id: 2,
      candidateName: 'Shuvo Hossain',
      email: 'shuvo@email.com',
      phone: '+880 1823-456789',
      appliedDate: '14/07/2024',
      status: 'Screening',
      rating: 4.2,
      source: 'Indeed',
      experience: '3+ years'
    },
    {
      id: 3,
      candidateName: 'Ziaul Amin',
      email: 'ziaul@email.com',
      phone: '+880 1823-456789',
      appliedDate: '13/07/2024',
      status: 'Interview',
      rating: 4.8,
      source: 'Website',
      experience: '4+ years'
    },
    {
      id: 4,
      candidateName: 'Mohammad Karim',
      email: 'd.karim@email.com',
      phone: '+880 1823-456789',
      appliedDate: '12/07/2024',
      status: 'Offer',
      rating: 4.6,
      source: 'Referral',
      experience: '6+ years'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'New': { bg: '#fff3cd', color: '#856404' },
      'Screening': { bg: '#e7f3ff', color: '#0056b3' },
      'Interview': { bg: '#f3e8ff', color: '#7c2d12' },
      'Offer': { bg: '#d4edda', color: '#155724' },
      'Rejected': { bg: '#f8d7da', color: '#721c24' }
    };
    return colors[status] || { bg: '#f8f9fa', color: '#666' };
  };

  const filteredApplications = applications.filter(app => {
    return statusFilter === 'all' || app.status.toLowerCase() === statusFilter;
  });

  const sortedApplications = filteredApplications.sort((a, b) => {
    switch(sortBy) {
      case 'name': return a.candidateName.localeCompare(b.candidateName);
      case 'date': return new Date(b.appliedDate) - new Date(a.appliedDate);
      case 'rating': return b.rating - a.rating;
      default: return 0;
    }
  });

  if (!job) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Applications for ${job.title}`} size="xl">
      {/* Header with job info and filters */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        padding: '16px 20px',
        background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
        borderRadius: '12px'
      }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#0C3D4A' }}>
            {job.title} - {job.department}
          </h3>
          <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
            📍 {job.location} • 📅 Posted: {job.postedDate} • 👥 {job.applicants} Total Applications
          </p>
        </div>
        <span style={{
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          background: job.status === 'Active' ? '#d4edda' : '#f8d7da',
          color: job.status === 'Active' ? '#155724' : '#721c24'
        }}>
          {job.status}
        </span>
      </div>

      {/* Filter Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        {/* Status Filter */}
        <div style={{
          display: 'flex',
          gap: '8px',
          background: '#f8f9fa',
          borderRadius: '8px',
          padding: '4px'
        }}>
          {['all', 'new', 'screening', 'interview', 'offer'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: statusFilter === status ? '#0C3D4A' : 'transparent',
                color: statusFilter === status ? 'white' : '#666',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                borderRadius: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span style={{
                marginLeft: '6px',
                padding: '2px 6px',
                borderRadius: '10px',
                fontSize: '11px',
                background: statusFilter === status ? 'rgba(255,255,255,0.2)' : 'rgba(12,61,74,0.1)'
              }}>
                {status === 'all' ? applications.length : applications.filter(a => a.status.toLowerCase() === status).length}
              </span>
            </button>
          ))}
        </div>

        {/* Sort Control */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '2px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </div>

      {/* Applications List */}
      <div style={{
        maxHeight: '400px',
        overflowY: 'auto',
        border: '1px solid #e2e8f0',
        borderRadius: '8px'
      }}>
        {sortedApplications.map((application, index) => (
          <div key={application.id} style={{
            display: 'grid',
            gridTemplateColumns: '1fr 120px 100px 120px 100px',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: index < sortedApplications.length - 1 ? '1px solid #f0f0f0' : 'none',
            background: 'white',
            transition: 'background 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
          onMouseLeave={(e) => e.target.style.background = 'white'}
          >
            {/* Candidate Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #0C3D4A, #1a4f5e)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {application.candidateName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div style={{ fontWeight: '600', color: '#333', fontSize: '14px' }}>
                  {application.candidateName}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {application.email}
                </div>
              </div>
            </div>

            {/* Applied Date */}
            <div style={{ fontSize: '14px', color: '#666' }}>
              {application.appliedDate}
            </div>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: '#f59e0b' }}>⭐</span>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>{application.rating}</span>
            </div>

            {/* Status */}
            <div>
              <span style={{
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                ...getStatusColor(application.status)
              }}>
                {application.status}
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '4px' }}>
              <button style={{
                padding: '6px 8px',
                background: '#e0f7fa',
                color: '#0C3D4A',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}>
                👁️
              </button>
              <button style={{
                padding: '6px 8px',
                background: '#fff3cd',
                color: '#856404',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}>
                💬
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginTop: '24px',
        padding: '16px',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#0C3D4A' }}>
            {applications.length}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>Total Applications</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>
            {applications.filter(a => a.status === 'Screening' || a.status === 'Interview').length}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>In Process</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#f59e0b' }}>
            {applications.filter(a => a.status === 'Interview').length}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>Interviews</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#8b5cf6' }}>
            {applications.filter(a => a.status === 'Offer').length}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>Offers Made</div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end',
        marginTop: '24px',
        paddingTop: '24px',
        borderTop: '1px solid #f0f0f0'
      }}>
        <button
          onClick={onClose}
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
          Close
        </button>
      </div>
    </Modal>
  );
};

export default JobApplicationsModal;