import React from 'react';
import Modal from '../common/Modal'; 
const ViewJobModal = ({ job, isOpen, onClose }) => {
  if (!job) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Job Details" size="large">
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
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #0C3D4A, #1a4f5e)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px'
            }}>
              💼
            </div>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#0C3D4A' }}>
                {job.title}
              </h3>
              <p style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#666' }}>
                {job.department} Department
              </p>
              <span style={{
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: '600',
                background: job.status === 'Active' ? '#d4edda' : '#f8d7da',
                color: job.status === 'Active' ? '#155724' : '#721c24'
              }}>
                {job.status}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '16px', fontSize: '18px', color: '#0C3D4A' }}>
              Job Information
            </h4>
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>📍 Location:</span>
                  <span style={{ fontWeight: '500' }}>{job.location}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>📅 Posted Date:</span>
                  <span style={{ fontWeight: '500' }}>{job.postedDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>👥 Total Applications:</span>
                  <span style={{ fontWeight: '500' }}>{job.applicants}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>💰 Salary Range:</span>
                  <span style={{ fontWeight: '500' }}>$80k - $120k</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>⏰ Employment Type:</span>
                  <span style={{ fontWeight: '500' }}>Full-time</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '16px', fontSize: '18px', color: '#0C3D4A' }}>
              Required Skills
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {job.title.includes('Software') && ['React', 'Node.js', 'JavaScript', 'Python', 'SQL'].map((skill, index) => (
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
              {job.title.includes('Product') && ['Product Strategy', 'Analytics', 'Leadership', 'Agile'].map((skill, index) => (
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
              {job.title.includes('UX') && ['Figma', 'User Research', 'Prototyping', 'Adobe Creative Suite'].map((skill, index) => (
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
              {job.title.includes('Data') && ['Python', 'Machine Learning', 'SQL', 'TensorFlow'].map((skill, index) => (
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
              {job.title.includes('DevOps') && ['AWS', 'Docker', 'Kubernetes', 'Jenkins'].map((skill, index) => (
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
              Job Description
            </h4>
            <div style={{ 
              background: '#f8f9fa', 
              padding: '20px', 
              borderRadius: '12px',
              lineHeight: '1.6',
              fontSize: '14px',
              color: '#333'
            }}>
              <p style={{ margin: '0 0 16px 0' }}>
                We are seeking a talented {job.title} to join our {job.department} team. 
                This is an excellent opportunity for a motivated professional to contribute 
                to our growing company and make a significant impact.
              </p>
              <p style={{ margin: '0 0 16px 0' }}>
                <strong>Key Responsibilities:</strong>
              </p>
              <ul style={{ margin: '0 0 16px 0', paddingLeft: '20px' }}>
                <li>Lead and execute strategic initiatives</li>
                <li>Collaborate with cross-functional teams</li>
                <li>Drive innovation and best practices</li>
                <li>Mentor junior team members</li>
              </ul>
              <p style={{ margin: '0' }}>
                <strong>Requirements:</strong> Bachelor's degree and relevant experience in the field.
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '16px', fontSize: '18px', color: '#0C3D4A' }}>
              Application Stats
            </h4>
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#0C3D4A' }}>
                    {job.applicants}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Total Applications</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
                    {Math.floor(job.applicants * 0.3)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Qualified</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>
                    {Math.floor(job.applicants * 0.15)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>In Interview</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#8b5cf6' }}>
                    {Math.floor(job.applicants * 0.05)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Offers Made</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '16px', fontSize: '18px', color: '#0C3D4A' }}>
              Hiring Manager
            </h4>
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #0C3D4A, #1a4f5e)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '700'
                }}>
                  HR
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#333' }}>HR Manager</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>hr@company.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewJobModal;