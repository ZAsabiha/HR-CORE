import React, { useState } from 'react';

const AddJobModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    description: '',
    requirements: [''],
    salary: '',
    status: 'Draft'
  });

  const [errors, setErrors] = useState({});

  const departments = [
    'Engineering',
    'Product',
    'Design',
    'Marketing',
    'Sales',
    'Analytics',
    'HR',
    'Finance',
    'Operations'
  ];

  const locations = [
    'Remote',
    'New York',
    'San Francisco',
    'Austin',
    'Chicago',
    'Seattle',
    'Boston',
    'Los Angeles'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData(prev => ({
      ...prev,
      requirements: newRequirements
    }));
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const removeRequirement = (index) => {
    if (formData.requirements.length > 1) {
      const newRequirements = formData.requirements.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        requirements: newRequirements
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.location) {
      newErrors.location = 'Location is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    }

    if (formData.requirements.some(req => !req.trim())) {
      newErrors.requirements = 'All requirements must be filled or removed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Create new job object
    const newJob = {
      id: Date.now(), // Simple ID generation
      title: formData.title.trim(),
      department: formData.department,
      location: formData.location,
      description: formData.description.trim(),
      requirements: formData.requirements.filter(req => req.trim()),
      salary: formData.salary.trim(),
      status: formData.status,
      applicants: 0,
      postedDate: new Date().toLocaleDateString('en-GB')
    };

    onAdd(newJob);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      department: '',
      location: '',
      description: '',
      requirements: [''],
      salary: '',
      status: 'Draft'
    });
    setErrors({});
    onClose();
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
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          borderBottom: '2px solid #f0f0f0',
          paddingBottom: '16px'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: '700',
            color: '#0C3D4A'
          }}>
            Post New Job
          </h2>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#999',
              padding: '4px'
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Job Title */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333'
            }}>
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Senior Software Engineer"
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${errors.title ? '#ef4444' : '#e2e8f0'}`,
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
            />
            {errors.title && (
              <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {errors.title}
              </span>
            )}
          </div>

          {/* Department and Location Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#333'
              }}>
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `2px solid ${errors.department ? '#ef4444' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && (
                <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  {errors.department}
                </span>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#333'
              }}>
                Location *
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `2px solid ${errors.location ? '#ef4444' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Select Location</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              {errors.location && (
                <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  {errors.location}
                </span>
              )}
            </div>
          </div>

          {/* Salary */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333'
            }}>
              Salary Range
            </label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g., $80,000 - $120,000"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Job Description */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333'
            }}>
              Job Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${errors.description ? '#ef4444' : '#e2e8f0'}`,
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
            {errors.description && (
              <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {errors.description}
              </span>
            )}
          </div>

          {/* Requirements */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333'
            }}>
              Requirements *
            </label>
            {formData.requirements.map((requirement, index) => (
              <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => handleRequirementChange(index, e.target.value)}
                  placeholder={`Requirement ${index + 1}`}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: `2px solid ${errors.requirements ? '#ef4444' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                {formData.requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    style={{
                      padding: '8px 12px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addRequirement}
              style={{
                padding: '8px 16px',
                background: '#0C3D4A',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                marginTop: '8px'
              }}
            >
              + Add Requirement
            </button>
            {errors.requirements && (
              <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {errors.requirements}
              </span>
            )}
          </div>

          {/* Status */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333'
            }}>
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: 'white'
              }}
            >
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            borderTop: '2px solid #f0f0f0',
            paddingTop: '20px'
          }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                padding: '12px 24px',
                background: '#f8f9fa',
                color: '#666',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #0C3D4A, #1a4f5e)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                boxShadow: '0 4px 15px rgba(12, 61, 74, 0.3)'
              }}
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobModal;