import React, { useState } from 'react';
import Sidebar from './Components/Sidebar';
import './RecruitmentDashboard.css';

// Import Modal Components
import ViewCandidateModal from './Components/modals/ViewCandidateModal';
import EditCandidateModal from './Components/modals/EditCandidateModal';
import ContactCandidateModal from './Components/modals/ContactCandidateModal';
import ScheduleInterviewModal from './Components/modals/ScheduleInterviewModal';

const RecruitmentDashboard = () => {
  const [activeTab, setActiveTab] = useState('candidates');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const stats = [
    { id: 1, title: 'Total Candidates', value: '247', change: '+12%', icon: '👥', color: 'blue' },
    { id: 2, title: 'Active Jobs', value: '23', change: '+3', icon: '💼', color: 'green' },
    { id: 3, title: 'Interviews Today', value: '8', change: '+2', icon: '📅', color: 'purple' },
    { id: 4, title: 'Avg. Time to Hire', value: '12 days', change: '-2 days', icon: '⏰', color: 'orange' }
  ];

  // Changed to useState so we can update candidates
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

  const jobPostings = [
    { id: 1, title: 'Senior Software Engineer', department: 'Engineering', applicants: 45, status: 'Active', location: 'Remote', postedDate: '01/07/2024' },
    { id: 2, title: 'Product Manager', department: 'Product', applicants: 32, status: 'Active', location: 'New York', postedDate: '28/06/2024' },
    { id: 3, title: 'UX Designer', department: 'Design', applicants: 28, status: 'Draft', location: 'San Francisco', postedDate: '25/06/2024' },
    { id: 4, title: 'Data Scientist', department: 'Analytics', applicants: 19, status: 'Active', location: 'Remote', postedDate: '22/06/2024' },
    { id: 5, title: 'DevOps Engineer', department: 'Engineering', applicants: 15, status: 'Active', location: 'Austin', postedDate: '20/06/2024' }
  ];

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

  // Handle interview scheduling
  const handleScheduleInterviewSave = (interviewData) => {
    // Here you would typically save the interview to your backend
    console.log('Interview scheduled:', interviewData);
    
    // Update candidate status to Interview if not already
    if (selectedCandidate && selectedCandidate.status === 'New' || selectedCandidate.status === 'Screening') {
      const updatedCandidate = { ...selectedCandidate, status: 'Interview' };
      handleSaveCandidate(updatedCandidate);
    }
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      'New': 'status-new',
      'Screening': 'status-screening',
      'Interview': 'status-interview',
      'Offer': 'status-offer',
      'Active': 'status-active',
      'Draft': 'status-draft'
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

  const filteredJobs = jobPostings.filter(job => {
    return job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           job.department.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-dashboard">
        {/* Top Navigation */}
        <div className="top-navigation">
          <div className="nav-links">
            <a href="#" className="nav-link">Home</a>
            <a href="#" className="nav-link">About</a>
            <a href="#" className="nav-link">Contacts</a>
            <a href="#" className="nav-link">Login</a>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Header Section */}
          <div className="content-header">
            <div className="page-icon">📊</div>
            <h1 className="page-title">Recruitment Management</h1>
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

          {/* Tab Buttons */}
          <div className="tab-buttons">
            <button 
              className={`tab-button ${activeTab === 'candidates' ? 'active' : ''}`}
              onClick={() => setActiveTab('candidates')}
            >
              Candidates
            </button>
            <button 
              className={`tab-button ${activeTab === 'jobs' ? 'active' : ''}`}
              onClick={() => setActiveTab('jobs')}
            >
              Job Postings
            </button>
          </div>

          {/* Search and Actions */}
          <div className="actions-row">
            <h2 className="section-title">
              {activeTab === 'candidates' ? 'Candidate Applications' : 'Active Job Postings'}
            </h2>
            <div className="search-actions">
              {activeTab === 'candidates' && (
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
              )}
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
              {activeTab === 'jobs' && (
                <button className="btn-primary">➕ Post New Job</button>
              )}
              {activeTab === 'candidates' && (
                <button className="btn-secondary">📤 Export</button>
              )}
            </div>
          </div>

          {/* Status Filter Tabs for Candidates */}
          {activeTab === 'candidates' && (
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
          )}

          {/* Candidates Grid */}
          {activeTab === 'candidates' && (
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
          )}

          {/* Job Postings Grid */}
          {activeTab === 'jobs' && (
            <div className="jobs-grid">
              {filteredJobs.map((job) => (
                <div key={job.id} className="job-card">
                  <div className="job-header">
                    <div className="job-icon">💼</div>
                    <div className="job-basic-info">
                      <h3 className="job-title">{job.title}</h3>
                      <p className="job-department">{job.department}</p>
                    </div>
                    <div className="job-status">
                      <span className={`status-badge ${getStatusClass(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="job-details">
                    <div className="detail-row">
                      <span className="detail-label">📍 Location:</span>
                      <span className="detail-value">{job.location}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">📅 Posted:</span>
                      <span className="detail-value">{job.postedDate}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">👥 Applicants:</span>
                      <span className="detail-value">{job.applicants}</span>
                    </div>
                  </div>

                  <div className="job-actions">
                    <button className="action-btn btn-view">👁️ View</button>
                    <button className="action-btn btn-edit">✏️ Edit</button>
                    <button className="action-btn btn-applications">📋 Applications</button>
                    <button className="action-btn btn-close">❌ Close</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Components */}
      <ViewCandidateModal
        candidate={selectedCandidate}
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
    </div>
  );
};

export default RecruitmentDashboard;