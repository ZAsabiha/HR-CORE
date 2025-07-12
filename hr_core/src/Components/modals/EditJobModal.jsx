import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal'; // Adjust path as needed

const EditJobModal = ({ job, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    status: 'Active',
    salaryMin: '',
    salaryMax: '',
    employmentType: 'Full-time',
    description: '',
    requirements: ''
  });

  // Update form data when job changes
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        department: job.department || '',
        location: job.location || '',
        status: job.status || 'Active',
        salaryMin: '80000',
        salaryMax: '120000',
        employmentType: 'Full-time',
        description: `We are seeking a talented ${job.title} to join our ${job.department} team.`,
        requirements: 'Bachelor\'s degree and relevant experience in the field.'
      });
    }
  }, [job]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const updatedJob = {
      ...job,
      ...formData
    };
    onSave(updatedJob);
    onClose();
  };

  if (!job) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Job Posting" size="large">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Left Column */}
        <div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500', 
              color: '#333' 
            }}>
              Job Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="Enter job title"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500', 
              color: '#333' 
            }}>
              Department *
            </label>
            <select
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              <option value="">Select department</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Design">Design</option>
              <option value="Analytics">Analytics</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">Human Resources</option>
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500', 
              color: '#333' 
            }}>
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="e.g. Remote, New York, San Francisco"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500', 
              color: '#333' 
            }}>
              Employment Type
            </label>
            <select
              value={formData.employmentType}
              onChange={(e) => handleInputChange('employmentType', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500', 
              color: '#333' 
            }}>
              Job Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Paused">Paused</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500', 
              color: '#333' 
            }}>
              Salary Range
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <input
                  type="number"
                  value={formData.salaryMin}
                  onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Min salary"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={formData.salaryMax}
                  onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Max salary"
                />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500', 
              color: '#333' 
            }}>
              Job Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              style={{
                width: '100%',
                height: '120px',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                resize: 'vertical',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
              placeholder="Describe the role, responsibilities, and what makes this position exciting..."
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500', 
              color: '#333' 
            }}>
              Requirements
            </label>
            <textarea
              value={formData.requirements}
              onChange={(e) => handleInputChange('requirements', e.target.value)}
              style={{
                width: '100%',
                height: '100px',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                resize: 'vertical',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
              placeholder="List the required qualifications, skills, and experience..."
            />
          </div>
        </div>
      </div>

      {/* Job Preview */}
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
          📋 Job Preview:
        </h4>
        <div style={{ 
          fontSize: '16px', 
          fontWeight: '600', 
          color: '#333',
          marginBottom: '4px'
        }}>
          {formData.title} - {formData.department}
        </div>
        <div style={{ 
          fontSize: '14px', 
          color: '#666'
        }}>
          📍 {formData.location} • 💰 ${parseInt(formData.salaryMin || 0).toLocaleString()} - ${parseInt(formData.salaryMax || 0).toLocaleString()} • ⏰ {formData.employmentType}
        </div>
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
          onClick={handleSave}
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
          💾 Save Changes
        </button>
      </div>
    </Modal>
  );
};

export default EditJobModal;