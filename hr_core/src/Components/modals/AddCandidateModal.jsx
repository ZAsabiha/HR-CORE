import React, { useState } from 'react';
import Modal from '../common/Modal'; // Adjust path as needed

const AddCandidateModal = ({ isOpen, onClose, onAdd, jobPostings }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    customPosition: '',
    experience: '',
    source: 'Manual Entry',
    skills: [],
    status: 'New'
  });

  const [newSkill, setNewSkill] = useState('');
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (formData.position === 'Other' && !formData.customPosition.trim()) {
      newErrors.position = 'Please specify the custom position';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Use custom position if "Other" was selected, otherwise use selected position
    const finalPosition = formData.position === 'Other' ? formData.customPosition : formData.position;

    const newCandidate = {
      id: Date.now(), // Simple ID generation
      ...formData,
      position: finalPosition, // Use the final position value
      appliedDate: new Date().toLocaleDateString('en-GB'),
      rating: 0, // Default rating
      source: formData.source || 'Manual Entry'
    };
    
    onAdd(newCandidate);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
      customPosition: '',
      experience: '',
      source: 'Manual Entry',
      skills: [],
      status: 'New'
    });
    setNewSkill('');
    setErrors({});
    
    onClose();
  };

  const handleCancel = () => {
    // Reset form when canceling
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
      customPosition: '',
      experience: '',
      source: 'Manual Entry',
      skills: [],
      status: 'New'
    });
    setNewSkill('');
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="Add New Candidate" size="large">
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
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `2px solid ${errors.name ? '#ef4444' : '#e2e8f0'}`,
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="Enter candidate's full name"
            />
            {errors.name && (
              <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {errors.name}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500', 
              color: '#333' 
            }}>
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `2px solid ${errors.email ? '#ef4444' : '#e2e8f0'}`,
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="Enter email address"
            />
            {errors.email && (
              <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {errors.email}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500', 
              color: '#333' 
            }}>
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `2px solid ${errors.phone ? '#ef4444' : '#e2e8f0'}`,
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="e.g. +880 1234-567890"
            />
            {errors.phone && (
              <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {errors.phone}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500', 
              color: '#333' 
            }}>
              Position Applied For *
            </label>
            <select
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `2px solid ${errors.position ? '#ef4444' : '#e2e8f0'}`,
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              <option value="">Select a position</option>
              {jobPostings && jobPostings
                .filter(job => job.status === 'Active') // Only show active jobs
                .map(job => (
                  <option key={job.id} value={job.title}>
                    {job.title} - {job.department}
                  </option>
                ))
              }
              <option value="Other">Other (Not listed)</option>
            </select>
            {errors.position && (
              <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {errors.position}
              </span>
            )}
            
            {/* Custom position input when "Other" is selected */}
            {formData.position === 'Other' && (
              <input
                type="text"
                value={formData.customPosition || ''}
                onChange={(e) => handleInputChange('customPosition', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  marginTop: '8px'
                }}
                placeholder="Enter custom position title"
              />
            )}
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
              Experience Level
            </label>
            <select
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              <option value="">Select experience level</option>
              <option value="Entry Level">Entry Level</option>
              <option value="1-2 years">1-2 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5+ years">5+ years</option>
              <option value="10+ years">10+ years</option>
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500', 
              color: '#333' 
            }}>
              Application Source
            </label>
            <select
              value={formData.source}
              onChange={(e) => handleInputChange('source', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              <option value="Manual Entry">Manual Entry</option>
              <option value="Website Application">Website Application</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Indeed">Indeed</option>
              <option value="Glassdoor">Glassdoor</option>
              <option value="Referral">Employee Referral</option>
              <option value="Career Fair">Career Fair</option>
              <option value="Email">Direct Email</option>
              <option value="Walk-in">Walk-in</option>
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500', 
              color: '#333' 
            }}>
              Initial Status
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
              <option value="New">New</option>
              <option value="Screening">Screening</option>
              <option value="Interview">Interview</option>
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500', 
              color: '#333' 
            }}>
              Skills
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="Add a skill"
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
              <button
                onClick={addSkill}
                type="button"
                style={{
                  padding: '12px 16px',
                  background: '#0C3D4A',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Add
              </button>
            </div>
            
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '8px',
              minHeight: '60px',
              padding: '12px',
              border: '2px dashed #e2e8f0',
              borderRadius: '8px',
              background: '#f8f9fa'
            }}>
              {formData.skills.length > 0 ? formData.skills.map((skill, index) => (
                <span key={index} style={{
                  background: '#e0f7fa',
                  color: '#0C3D4A',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  height: 'fit-content'
                }}>
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#666',
                      cursor: 'pointer',
                      fontSize: '14px',
                      padding: '0 2px'
                    }}
                  >
                    ×
                  </button>
                </span>
              )) : (
                <span style={{ 
                  color: '#999', 
                  fontSize: '14px', 
                  fontStyle: 'italic',
                  alignSelf: 'center'
                }}>
                  Add skills using the field above
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form Preview */}
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
          👤 Candidate Preview:
        </h4>
        <div style={{ 
          fontSize: '16px', 
          fontWeight: '600', 
          color: '#333',
          marginBottom: '4px'
        }}>
          {formData.name || 'Candidate Name'} - {
            formData.position === 'Other' 
              ? (formData.customPosition || 'Custom Position') 
              : (formData.position || 'Position')
          }
        </div>
        <div style={{ 
          fontSize: '14px', 
          color: '#666'
        }}>
          📧 {formData.email || 'email@example.com'} • 📱 {formData.phone || 'Phone Number'} • 🔗 {formData.source}
        </div>
        {jobPostings && formData.position && formData.position !== 'Other' && (
          <div style={{ 
            fontSize: '12px', 
            color: '#10b981',
            marginTop: '4px'
          }}>
            ✓ Applying for active job posting
          </div>
        )}
      </div>

      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end',
        paddingTop: '24px',
        borderTop: '1px solid #f0f0f0'
      }}>
        <button
          onClick={handleCancel}
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
          onClick={handleSubmit}
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
          ➕ Add Candidate
        </button>
      </div>
    </Modal>
  );
};

export default AddCandidateModal;