import React, { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import Sidebar from './Components/Sidebar';          
import './Components/Sidebar.css';
import './LeaveRequests.css';

const LeaveRequestsPage = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Requests');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  const leaveRequests = [
    {
      id: 1,
      name: 'Sanjana Afreen',
      duration: 5,
      startDate: '22/04/2022',
      endDate: '28/04/2022',
      type: 'Sick',
      status: 'Pending'
    },
    {
      id: 2,
      name: 'Israt Risha Ivey',
      duration: 7,
      startDate: '22/04/2022',
      endDate: '30/04/2022',
      type: 'Emergency',
      status: 'Approved'
    },
    {
      id: 3,
      name: 'Zannatul Adon Sabiha',
      duration: 120,
      startDate: '22/04/2022',
      endDate: '28/06/2022',
      type: 'Maternity',
      status: 'Approved'
    },
    {
      id: 4,
      name: 'Yusha Mahmud',
      duration: 5,
      startDate: '22/04/2022',
      endDate: '28/04/2022',
      type: 'Sick',
      status: 'Pending'
    },
    {
      id: 5,
      name: 'Nazia Afreen',
      duration: 5,
      startDate: '22/04/2022',
      endDate: '28/04/2022',
      type: 'Emergency',
      status: 'Declined'
    },
    {
      id: 6,
      name: 'Ishmam Mahmud',
      duration: 5,
      startDate: '22/04/2022',
      endDate: '28/04/2022',
      type: 'Annual',
      status: 'Declined'
    },
    {
      id: 7,
      name: 'Mahmud Rashed',
      duration: 5,
      startDate: '22/04/2022',
      endDate: '28/04/2022',
      type: 'Sick',
      status: 'Pending'
    }
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'approved';
      case 'Declined':
        return 'declined';
      case 'Pending':
        return 'pending';
      default:
        return '';
    }
  };

  const ActionButton = ({ status, requestId }) => {
    const isOpen = openDropdown === requestId;
    
    if (status === 'Pending') {
      return (
        <div className="action-buttons-container">
          <button 
            onClick={() => handleAction('approve', requestId)}
            className="action-button approve"
          >
            Approve
          </button>
          <button 
            onClick={() => handleAction('decline', requestId)}
            className="action-button decline"
          >
            Decline
          </button>
          <button 
            onClick={() => handleAction('details', requestId)}
            className="action-button details"
          >
            View Details
          </button>
        </div>
      );
    }

    if (status === 'Approved' || status === 'Declined') {
      return (
        <div className="action-buttons-container">
          <button 
            onClick={() => handleAction('details', requestId)}
            className="action-button details"
          >
            View Details
          </button>
        </div>
      );
    }

    return (
      <div className="actions-dropdown">
        <button 
          onClick={() => setOpenDropdown(isOpen ? null : requestId)}
          className="actions-dropdown-button"
        >
          Actions
          <ChevronDown style={{ width: '1rem', height: '1rem' }} />
        </button>
        {isOpen && (
          <div className="dropdown">
            <button 
              onClick={() => {
                handleAction('details', requestId);
                setOpenDropdown(null);
              }}
              className="dropdown-item"
            >
              View Details
            </button>
          </div>
        )}
      </div>
    );
  };

  // Filter requests based on selected filter
  const filteredRequests = leaveRequests.filter(request => {
    const matchesSearch = request.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'All Requests' || request.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleAction = (action, requestId) => {
    console.log(`${action} action for request ${requestId}`);
  };

  const handleLogout = () => {
    alert('Logging out...');
    // Add your logout logic here
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />
      
      {/* Main Content */}
      <div className="main-container">
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="nav-content">
            <div className="nav-links">
              <button className="nav-link">Home</button>
              <button className="nav-link">About</button>
              <button className="nav-link">Contacts</button>
              <button className="nav-link">Login</button>
            </div>
          </div>
        </nav>

        {/* Header */}
        <div className="header">
          <div className="header-content">
            <div className="header-left">
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Leave Management Header */}
          <div className="page-header">
            <div className="black-square"></div>
            <h1 className="page-title">Leave Management</h1>
          </div>

          {/* Navigation Tabs */}
          <div className="tabs">
            <button
              onClick={() => setActiveTab('requests')}
              className={`tab ${activeTab === 'requests' ? 'active' : 'inactive'}`}
            >
              Leave Requests
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`tab ${activeTab === 'history' ? 'active' : 'inactive'}`}
            >
              Leave History
            </button>
          </div>

          {/* Content Area */}
          <div className="content-area">
            {/* Table Header */}
            <div className="table-header">
              <div className="table-header-left">
                <h2 className="table-title">Leave Requests</h2>
              </div>
              <div className="table-header-right">
                <div className="search-container">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                <div style={{ position: 'relative' }}>
                  <button 
                    onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                    className="filter-button"
                  >
                    <Filter style={{ width: '1.25rem', height: '1.25rem' }} />
                  </button>
                  {filterDropdownOpen && (
                    <div className="dropdown">
                      <button 
                        onClick={() => {
                          setSelectedFilter('All Requests');
                          setFilterDropdownOpen(false);
                        }}
                        className="dropdown-item"
                      >
                        All Requests
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedFilter('Pending');
                          setFilterDropdownOpen(false);
                        }}
                        className="dropdown-item"
                      >
                        Pending
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedFilter('Approved');
                          setFilterDropdownOpen(false);
                        }}
                        className="dropdown-item"
                      >
                        Approved
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedFilter('Declined');
                          setFilterDropdownOpen(false);
                        }}
                        className="dropdown-item"
                      >
                        Declined
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="table-container">
              <table className="table">
                <thead className="table-head">
                  <tr>
                    <th className="table-header-cell">Name(s)</th>
                    <th className="table-header-cell">Duration(s)</th>
                    <th className="table-header-cell">Start Date</th>
                    <th className="table-header-cell">End Date</th>
                    <th className="table-header-cell">Type</th>
                    <th className="table-header-cell">Status</th>
                    <th className="table-header-cell actions">Actions</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="table-row">
                      <td className="table-cell">{request.name}</td>
                      <td className="table-cell">{request.duration}</td>
                      <td className="table-cell">{request.startDate}</td>
                      <td className="table-cell">{request.endDate}</td>
                      <td className="table-cell">{request.type}</td>
                      <td className="table-cell">
                        <span className={`status-badge ${getStatusClass(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="table-cell actions">
                        <ActionButton 
                          status={request.status}
                          requestId={request.id}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestsPage;