import React, { useState } from 'react';

// Import Job Modal Components
import ViewJobModal from './Components/modals/ViewJobModal.jsx';
import EditJobModal from './Components/modals/EditJobModal.jsx';
import JobApplicationsModal from './Components/modals/JobApplicationsModal.jsx';
import CloseJobModal from './Components/modals/CloseJobModal.jsx';
import AddJobModal from './Components/modals/AddJobModal.jsx';

const JobPostingsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Job Modal states
  const [viewJobModalOpen, setViewJobModalOpen] = useState(false);
  const [editJobModalOpen, setEditJobModalOpen] = useState(false);
  const [jobApplicationsModalOpen, setJobApplicationsModalOpen] = useState(false);
  const [closeJobModalOpen, setCloseJobModalOpen] = useState(false);
  const [addJobModalOpen, setAddJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const stats = [
    { id: 1, title: 'Active Jobs', value: '23', change: '+3', icon: '💼', color: 'green' },
    { id: 2, title: 'Total Applications', value: '847', change: '+45', icon: '📝', color: 'blue' },
    { id: 3, title: 'Jobs Filled This Month', value: '8', change: '+2', icon: '✅', color: 'purple' },
    { id: 4, title: 'Avg. Applications per Job', value: '37', change: '+5', icon: '📊', color: 'orange' }
  ];

  const [jobPostings, setJobPostings] = useState([
    { 
      id: 1, 
      title: 'Senior Software Engineer', 
      department: 'Engineering', 
      applicants: 45, 
      status: 'Active', 
      location: 'Remote', 
      postedDate: '01/07/2024',
      description: 'We are looking for a senior software engineer with expertise in React and Node.js.',
      requirements: ['5+ years experience', 'React expertise', 'Node.js knowledge'],
      salary: '$90,000 - $120,000'
    },
    { 
      id: 2, 
      title: 'Product Manager', 
      department: 'Product', 
      applicants: 32, 
      status: 'Active', 
      location: 'New York', 
      postedDate: '28/06/2024',
      description: 'Seeking an experienced product manager to lead our mobile product initiatives.',
      requirements: ['3+ years PM experience', 'Mobile product experience', 'Analytics skills'],
      salary: '$85,000 - $110,000'
    },
    { 
      id: 3, 
      title: 'UX Designer', 
      department: 'Design', 
      applicants: 28, 
      status: 'Draft', 
      location: 'San Francisco', 
      postedDate: '25/06/2024',
      description: 'Looking for a creative UX designer to join our design team.',
      requirements: ['Figma expertise', 'User research experience', 'Portfolio required'],
      salary: '$70,000 - $95,000'
    },
    { 
      id: 4, 
      title: 'Data Scientist', 
      department: 'Analytics', 
      applicants: 19, 
      status: 'Active', 
      location: 'Remote', 
      postedDate: '22/06/2024',
      description: 'Join our data team to drive insights and build predictive models.',
      requirements: ['Python/R expertise', 'Machine Learning experience', 'SQL knowledge'],
      salary: '$95,000 - $130,000'
    },
    { 
      id: 5, 
      title: 'DevOps Engineer', 
      department: 'Engineering', 
      applicants: 15, 
      status: 'Active', 
      location: 'Austin', 
      postedDate: '20/06/2024',
      description: 'Seeking a DevOps engineer to manage our cloud infrastructure.',
      requirements: ['AWS experience', 'Docker/Kubernetes', 'CI/CD expertise'],
      salary: '$85,000 - $115,000'
    },
    { 
      id: 6, 
      title: 'Marketing Manager', 
      department: 'Marketing', 
      applicants: 22, 
      status: 'Closed', 
      location: 'Remote', 
      postedDate: '15/06/2024',
      description: 'Lead our digital marketing efforts and campaign strategies.',
      requirements: ['Digital marketing experience', 'Campaign management', 'Analytics skills'],
      salary: '$70,000 - $90,000'
    }
  ]);

  // Job action handlers
  const handleViewJob = (job) => {
    setSelectedJob(job);
    setViewJobModalOpen(true);
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setEditJobModalOpen(true);
  };

  const handleViewJobApplications = (job) => {
    setSelectedJob(job);
    setJobApplicationsModalOpen(true);
  };

  const handleCloseJob = (job) => {
    setSelectedJob(job);
    setCloseJobModalOpen(true);
  };

  // Save job changes
  const handleSaveJob = (updatedJob) => {
    setJobPostings(prev => 
      prev.map(job => 
        job.id === updatedJob.id ? updatedJob : job
      )
    );
  };

  // Handle job closure
  const handleConfirmCloseJob = (closeData) => {
    setJobPostings(prev => 
      prev.map(job => 
        job.id === closeData.jobId ? { ...job, status: 'Closed' } : job
      )
    );
    console.log('Job closed:', closeData);
  };

  // Handle adding new job
  const handleAddJob = (newJob) => {
    setJobPostings(prev => [newJob, ...prev]);
    alert('Job posted successfully!');
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      'Active': 'status-active',
      'Draft': 'status-draft',
      'Closed': 'status-closed'
    };
    return statusClasses[status] || 'status-default';
  };

  const filteredJobs = jobPostings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
           job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedAndFilteredJobs = filteredJobs.sort((a, b) => {
    switch(sortBy) {
      case 'title': return a.title.localeCompare(b.title);
      case 'date': return new Date(b.postedDate) - new Date(a.postedDate);
      case 'applicants': return b.applicants - a.applicants;
      case 'department': return a.department.localeCompare(b.department);
      default: return 0;
    }
  });

  return (
    <div className="main-content">
      {/* Header Section */}
      <div className="content-header">
        <div className="page-icon">💼</div>
        <h1 className="page-title">Job Postings Management</h1>
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
        <h2 className="section-title">Job Postings</h2>
        <div className="search-actions">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button className="search-icon">🔍</button>
          </div>
          <button className="filter-button">⚙️</button>
          <button 
            className="btn-primary"
            onClick={() => setAddJobModalOpen(true)}
          >
            ➕ Post New Job
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="status-filter-container">
        <div className="status-filter-tabs">
          {['all', 'active', 'draft', 'closed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`status-tab ${statusFilter === status ? 'active' : ''}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="status-count">
                {status === 'all' 
                  ? filteredJobs.length 
                  : jobPostings.filter(j => j.status.toLowerCase() === status && 
                      (j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       j.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       j.location.toLowerCase().includes(searchTerm.toLowerCase()))).length
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
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
            <option value="applicants">Sort by Applicants</option>
            <option value="department">Sort by Department</option>
          </select>
        </div>
      </div>

      {/* Job Postings Grid */}
      <div className="jobs-grid">
        {sortedAndFilteredJobs.map((job) => (
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
              {job.salary && (
                <div className="detail-row">
                  <span className="detail-label">💰 Salary:</span>
                  <span className="detail-value">{job.salary}</span>
                </div>
              )}
            </div>

            {job.description && (
              <div className="job-description">
                <p>{job.description.length > 100 ? job.description.substring(0, 100) + '...' : job.description}</p>
              </div>
            )}

            <div className="job-actions">
              <button 
                className="action-btn btn-view"
                onClick={() => handleViewJob(job)}
              >
                👁️ View
              </button>
              <button 
                className="action-btn btn-edit"
                onClick={() => handleEditJob(job)}
              >
                ✏️ Edit
              </button>
              <button 
                className="action-btn btn-applications"
                onClick={() => handleViewJobApplications(job)}
              >
                📋 Applications
              </button>
              <button 
                className="action-btn btn-close"
                onClick={() => handleCloseJob(job)}
                disabled={job.status === 'Closed'}
                style={{
                  opacity: job.status === 'Closed' ? 0.5 : 1,
                  cursor: job.status === 'Closed' ? 'not-allowed' : 'pointer'
                }}
              >
                {job.status === 'Closed' ? '✅ Closed' : '❌ Close'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Components */}
      <ViewJobModal
        job={selectedJob}
        isOpen={viewJobModalOpen}
        onClose={() => setViewJobModalOpen(false)}
      />
      
      <EditJobModal
        job={selectedJob}
        isOpen={editJobModalOpen}
        onClose={() => setEditJobModalOpen(false)}
        onSave={handleSaveJob}
      />
      
      <JobApplicationsModal
        job={selectedJob}
        isOpen={jobApplicationsModalOpen}
        onClose={() => setJobApplicationsModalOpen(false)}
      />
      
      <CloseJobModal
        job={selectedJob}
        isOpen={closeJobModalOpen}
        onClose={() => setCloseJobModalOpen(false)}
        onConfirm={handleConfirmCloseJob}
      />

      <AddJobModal
        isOpen={addJobModalOpen}
        onClose={() => setAddJobModalOpen(false)}
        onAdd={handleAddJob}
      />
    </div>
  );
};

export default JobPostingsPage;