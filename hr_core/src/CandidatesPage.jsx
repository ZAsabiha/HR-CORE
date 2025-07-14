import React, { useState } from 'react';

// Import Modal Components
import ViewCandidateModal from './Components/modals/ViewCandidateModal.jsx';
import EditCandidateModal from './Components/modals/EditCandidateModal.jsx';
import ContactCandidateModal from './Components/modals/ContactCandidateModal.jsx';
import ScheduleInterviewModal from './Components/modals/ScheduleInterviewModal.jsx';
import AddCandidateModal from './Components/modals/AddCandidateModal.jsx';

const CandidatesPage = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [addCandidateModalOpen, setAddCandidateModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Store interviews separately
  const [interviews, setInterviews] = useState([]);

  const stats = [
    { id: 1, title: 'Total Candidates', value: '247', change: '+12%', icon: '👥', color: 'blue' },
    { id: 2, title: 'New Applications', value: '45', change: '+8', icon: '📝', color: 'green' },
    { id: 3, title: 'Interviews Scheduled', value: '12', change: '+3', icon: '📅', color: 'purple' },
    { id: 4, title: 'Offers Extended', value: '5', change: '+2', icon: '✅', color: 'orange' }
  ];

  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: 'Raisa Raihan',
      email: 'prithwi@email.com',
      phone: '+8801824031787',
      position: 'Senior Software Engineer',
      experience: '5+ years',
      status: 'New',
      appliedDate: '15/07/2024',
      source: 'LinkedIn',
      rating: 4.5,
      skills: ['React', 'Node.js', 'Python', 'AWS', 'MongoDB']
    },
    {
      id: 2,
      name: 'Shuvo Hossain',
      email: 'm.rodriguez@email.com',
      phone: '+880 1823-456789',
      position: 'Product Manager',
      experience: '3+ years',
      status: 'Screening',
      appliedDate: '14/07/2024',
      source: 'Indeed',
      rating: 4.2,
      skills: ['Product Strategy', 'Analytics', 'Leadership', 'Agile']
    },
    {
      id: 3,
      name: 'Ziaul Amin',
      email: 'e.liu@email.com',
      phone: '+880 1823-456789',
      position: 'UX Designer',
      experience: '4+ years',
      status: 'Interview',
      appliedDate: '13/07/2024',
      source: 'Website',
      rating: 4.8,
      skills: ['Figma', 'User Research', 'Prototyping', 'Adobe Creative Suite']
    },
    {
      id: 4,
      name: 'Mohammad Karim',
      email: 'd.karim@email.com',
      phone: '+880 1823-456789',
      position: 'Data Scientist',
      experience: '6+ years',
      status: 'Offer',
      appliedDate: '12/07/2024',
      source: 'Referral',
      rating: 4.6,
      skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'R']
    },
    {
      id: 5,
      name: 'Fatima Begum',
      email: 'fatima.begum@email.com',
      phone: '+880 1934-567890',
      position: 'DevOps Engineer',
      experience: '4+ years',
      status: 'New',
      appliedDate: '11/07/2024',
      source: 'LinkedIn',
      rating: 4.3,
      skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform']
    },
    {
      id: 6,
      name: 'Shohel Ahmed',
      email: 'shohel.ahmed@email.com',
      phone: '+880 1645-678901',
      position: 'Frontend Developer',
      experience: '3+ years',
      status: 'Screening',
      appliedDate: '10/07/2024',
      source: 'Indeed',
      rating: 4.1,
      skills: ['Vue.js', 'CSS', 'JavaScript', 'TypeScript', 'Sass']
    }
  ]);

  const [jobPostings] = useState([
    { id: 1, title: 'Senior Software Engineer', department: 'Engineering', applicants: 45, status: 'Active', location: 'Remote', postedDate: '01/07/2024' },
    { id: 2, title: 'Product Manager', department: 'Product', applicants: 32, status: 'Active', location: 'New York', postedDate: '28/06/2024' },
    { id: 3, title: 'UX Designer', department: 'Design', applicants: 28, status: 'Draft', location: 'San Francisco', postedDate: '25/06/2024' },
    { id: 4, title: 'Data Scientist', department: 'Analytics', applicants: 19, status: 'Active', location: 'Remote', postedDate: '22/06/2024' },
    { id: 5, title: 'DevOps Engineer', department: 'Engineering', applicants: 15, status: 'Active', location: 'Austin', postedDate: '20/06/2024' }
  ]);

  // Modal action handlers
  const handleViewCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setViewModalOpen(true);
  };

  const handleEditCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setEditModalOpen(true);
  };

  const handleContactCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setContactModalOpen(true);
  };

  const handleScheduleInterview = (candidate) => {
    setSelectedCandidate(candidate);
    setScheduleModalOpen(true);
  };

  // Save candidate changes
  const handleSaveCandidate = (updatedCandidate) => {
    setCandidates(prev => 
      prev.map(candidate => 
        candidate.id === updatedCandidate.id ? updatedCandidate : candidate
      )
    );
  };

  // Add new candidate
  const handleAddCandidate = (newCandidate) => {
    setCandidates(prev => [newCandidate, ...prev]);
    alert('Candidate added successfully!');
  };

  // Handle interview scheduling - NOW STORES INTERVIEW DATA
  const handleScheduleInterviewSave = (interviewData) => {
    // Store the interview
    const newInterview = {
      ...interviewData,
      id: Date.now(), // Simple ID generation
      createdAt: new Date().toISOString()
    };
    
    setInterviews(prev => [...prev, newInterview]);
    
    // Update candidate status to Interview if not already
    if (selectedCandidate && (selectedCandidate.status === 'New' || selectedCandidate.status === 'Screening')) {
      const updatedCandidate = { ...selectedCandidate, status: 'Interview' };
      handleSaveCandidate(updatedCandidate);
    }
    
    console.log('Interview scheduled:', newInterview);
  };

  // Get interviews for a specific candidate
  const getCandidateInterviews = (candidateId) => {
    return interviews.filter(interview => interview.candidateId === candidateId);
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      'New': 'status-new',
      'Screening': 'status-screening',
      'Interview': 'status-interview',
      'Offer': 'status-offer'
    };
    return statusClasses[status] || 'status-default';
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
           candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || candidate.status.toLowerCase() === statusFilter;
    const matchesJob = jobFilter === 'all' || candidate.position === jobFilter;
    
    return matchesSearch && matchesStatus && matchesJob;
  });

  const sortedAndFilteredCandidates = filteredCandidates.sort((a, b) => {
    switch(sortBy) {
      case 'name': return a.name.localeCompare(b.name);
      case 'date': return new Date(b.appliedDate) - new Date(a.appliedDate);
      case 'rating': return b.rating - a.rating;
      default: return 0;
    }
  });

  return (
    <div className="main-content">
      {/* Header Section */}
      <div className="content-header">
        <div className="page-icon">👥</div>
        <h1 className="page-title">Candidate Management</h1>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.id} className={`stat-card stat-${stat.color}`}>
            <div className="stat-content">
              <div className="stat-info">
                <h3 className="stat-title">{stat.title}</h3>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-change">{stat.change}</div>
              </div>
              <div className="stat-icon">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Actions */}
      <div className="actions-row">
        <h2 className="section-title">Candidate Applications</h2>
        <div className="search-actions">
          <select
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Positions</option>
            {[...new Set(candidates.map(c => c.position))].map(position => (
              <option key={position} value={position}>{position}</option>
            ))}
          </select>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button className="search-icon">🔍</button>
          </div>
          <button className="filter-button">⚙️</button>
          <button
            onClick={() => setAddCandidateModalOpen(true)}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #0C3D4A, #1a4f5e)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(12, 61, 74, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            <span style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px'
            }}>
              ➕
            </span>
            Add New Candidate
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="status-filter-container">
        <div className="status-filter-tabs">
          {['all', 'new', 'screening', 'interview', 'offer'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`status-tab ${statusFilter === status ? 'active' : ''}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="status-count">
                {status === 'all' 
                  ? filteredCandidates.length 
                  : candidates.filter(c => c.status.toLowerCase() === status && 
                      (jobFilter === 'all' || c.position === jobFilter) &&
                      (c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       c.position.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       c.email.toLowerCase().includes(searchTerm.toLowerCase()))).length
                }
              </span>
            </button>
          ))}
        </div>
        <div className="sort-container">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="date">Sort by Date</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="candidates-grid">
        {sortedAndFilteredCandidates.map((candidate) => (
          <div key={candidate.id} className="candidate-card">
            <div className="candidate-header">
              <div className="candidate-avatar">
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="candidate-basic-info">
                <h3 className="candidate-name">{candidate.name}</h3>
                <p className="candidate-position">{candidate.position}</p>
                <div className="candidate-rating">
                  <span>⭐</span>
                  <span>{candidate.rating}</span>
                </div>
              </div>
              <div className="candidate-status">
                <span className={`status-badge ${getStatusClass(candidate.status)}`}>
                  {candidate.status}
                </span>
              </div>
            </div>
            
            <div className="candidate-details">
              <div className="detail-row">
                <span className="detail-label">📧 Email:</span>
                <span className="detail-value">{candidate.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">📱 Phone:</span>
                <span className="detail-value">{candidate.phone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">📅 Applied:</span>
                <span className="detail-value">{candidate.appliedDate}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">🔗 Source:</span>
                <span className="detail-value">{candidate.source}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">💼 Experience:</span>
                <span className="detail-value">{candidate.experience}</span>
              </div>
            </div>

            <div className="candidate-skills">
              {candidate.skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>

            <div className="candidate-actions">
              <button 
                className="action-btn btn-view"
                onClick={() => handleViewCandidate(candidate)}
              >
                👁️ View
              </button>
              <button 
                className="action-btn btn-edit"
                onClick={() => handleEditCandidate(candidate)}
              >
                ✏️ Edit
              </button>
              <button 
                className="action-btn btn-contact"
                onClick={() => handleContactCandidate(candidate)}
              >
                💬 Contact
              </button>
              <button 
                className="action-btn btn-schedule"
                onClick={() => handleScheduleInterview(candidate)}
              >
                📅 Schedule
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Components */}
      <ViewCandidateModal
        candidate={selectedCandidate}
        candidateInterviews={selectedCandidate ? getCandidateInterviews(selectedCandidate.id) : []}
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
      />
      
      <EditCandidateModal
        candidate={selectedCandidate}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveCandidate}
      />
      
      <ContactCandidateModal
        candidate={selectedCandidate}
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
      
      <ScheduleInterviewModal
        candidate={selectedCandidate}
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onSchedule={handleScheduleInterviewSave}
      />

      <AddCandidateModal
        isOpen={addCandidateModalOpen}
        onClose={() => setAddCandidateModalOpen(false)}
        onAdd={handleAddCandidate}
        jobPostings={jobPostings}
      />
    </div>
  );
};

export default CandidatesPage;