import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000';

const JobApplicationsModal = ({ job, isOpen, onClose }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (isOpen && job) {
      fetchApplications();
    }
  }, [isOpen, job]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/jobs/${job.id}/applications`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      
      const data = await response.json();
      setApplications(data);
      
    } catch (err) {
      setError('Failed to load applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'new': { bg: '#fff3cd', color: '#856404', text: 'New' },
      'screening': { bg: '#e7f3ff', color: '#0056b3', text: 'Screening' },
      'interview': { bg: '#f3e8ff', color: '#7c2d12', text: 'Interview' },
      'offer': { bg: '#d4edda', color: '#155724', text: 'Offer' },
      'rejected': { bg: '#f8d7da', color: '#721c24', text: 'Rejected' }
    };
    const statusLower = status?.toLowerCase() || 'new';
    return colors[statusLower] || { bg: '#f8f9fa', color: '#666', text: status || 'New' };
  };

  const filteredApplications = applications.filter(app => {
    return statusFilter === 'all' || app.status?.toLowerCase() === statusFilter;
  });

  const statusCounts = {
    all: applications.length,
    new: applications.filter(app => app.status?.toLowerCase() === 'new').length,
    screening: applications.filter(app => app.status?.toLowerCase() === 'screening').length,
    interview: applications.filter(app => app.status?.toLowerCase() === 'interview').length,
    offer: applications.filter(app => app.status?.toLowerCase() === 'offer').length,
    rejected: applications.filter(app => app.status?.toLowerCase() === 'rejected').length
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(135deg, #0C3D4A, #1a5c6b)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '700' }}>
              Applications for {job.title}
            </h2>
            <p style={{ margin: '0', fontSize: '14px', opacity: '0.9' }}>
              {job.department} • {job.location} • Posted: {job.postedDate}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '18px',
              cursor: 'pointer',
              color: 'white',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div style={{
          padding: '20px 32px',
          borderBottom: '1px solid #f0f0f0',
          background: '#f8f9fa'
        }}>
          <div style={{
            display: 'flex',
            gap: '8px',
            background: '#fff',
            borderRadius: '8px',
            padding: '4px'
          }}>
            {[
              { key: 'all', label: 'All' },
              { key: 'new', label: 'New' },
              { key: 'screening', label: 'Screening' },
              { key: 'interview', label: 'Interview' },
              { key: 'offer', label: 'Offer' },
              { key: 'rejected', label: 'Rejected' }
            ].map((status) => (
              <button
                key={status.key}
                onClick={() => setStatusFilter(status.key)}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  background: statusFilter === status.key ? '#0C3D4A' : 'transparent',
                  color: statusFilter === status.key ? 'white' : '#666',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {status.label}
                <span style={{
                  padding: '2px 6px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  background: statusFilter === status.key ? 'rgba(255,255,255,0.2)' : 'rgba(12,61,74,0.1)',
                  minWidth: '18px',
                  textAlign: 'center'
                }}>
                  {statusCounts[status.key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 32px', maxHeight: '60vh', overflowY: 'auto' }}>
          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ fontSize: '32px' }}>⏳</div>
              <p>Loading applications...</p>
            </div>
          ) : error ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ fontSize: '32px' }}>⚠️</div>
              <p>{error}</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
              flexDirection: 'column',
              gap: '16px',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '48px' }}>📄</div>
              <h3>No Applications Found</h3>
              <p>No candidates have applied for this position yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredApplications.map((application, index) => {
                const candidate = application.candidate;
                const statusInfo = getStatusColor(application.status);
                
                return (
                  <div key={application.id || index} style={{
                    padding: '16px 20px',
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = '#0C3D4A';
                    e.target.style.boxShadow = '0 4px 12px rgba(12, 61, 74, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: 'linear-gradient(135deg, #0C3D4A, #1a5c6b)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>
                          {candidate?.name ? candidate.name.split(' ').map(n => n[0]).join('') : '?'}
                        </div>
                        <div>
                          <h4 style={{
                            margin: '0 0 4px 0',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#1f2937'
                          }}>
                            {candidate?.name || 'Unknown Candidate'}
                          </h4>
                          <p style={{
                            margin: '0',
                            fontSize: '14px',
                            color: '#6b7280'
                          }}>
                            {candidate?.email || 'No email provided'}
                          </p>
                        </div>
                      </div>
                      
                      <div style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        background: statusInfo.bg,
                        color: statusInfo.color
                      }}>
                        {statusInfo.text}
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '16px',
                      fontSize: '14px'
                    }}>
                      <div>
                        <span style={{ color: '#6b7280', fontWeight: '500' }}>Phone: </span>
                        <span style={{ color: '#374151' }}>{candidate?.phone || 'Not provided'}</span>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280', fontWeight: '500' }}>Experience: </span>
                        <span style={{ color: '#374151' }}>{candidate?.experience || 'Not specified'}</span>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280', fontWeight: '500' }}>Applied: </span>
                        <span style={{ color: '#374151' }}>{application.appliedDate || 'Unknown'}</span>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280', fontWeight: '500' }}>Source: </span>
                        <span style={{ color: '#374151' }}>{candidate?.source || 'Website'}</span>
                      </div>
                    </div>

                    {candidate?.skills && candidate.skills.length > 0 && (
                      <div style={{ marginTop: '12px' }}>
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '6px'
                        }}>
                          {candidate.skills.slice(0, 5).map((skill, skillIndex) => (
                            <span key={skillIndex} style={{
                              padding: '2px 8px',
                              background: '#f3f4f6',
                              color: '#374151',
                              borderRadius: '4px',
                              fontSize: '12px'
                            }}>
                              {skill}
                            </span>
                          ))}
                          {candidate.skills.length > 5 && (
                            <span style={{
                              padding: '2px 8px',
                              background: '#e5e7eb',
                              color: '#6b7280',
                              borderRadius: '4px',
                              fontSize: '12px'
                            }}>
                              +{candidate.skills.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with summary */}
        <div style={{
          padding: '20px 32px',
          borderTop: '1px solid #e5e7eb',
          background: '#f8f9fa',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            Showing {filteredApplications.length} of {applications.length} applications
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #0C3D4A, #1a5c6b)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationsModal;