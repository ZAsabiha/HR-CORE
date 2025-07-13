import React, { useState } from 'react';
<<<<<<< HEAD
<<<<<<< HEAD
import { Search, Filter, ChevronDown, Menu } from 'lucide-react';
import Sidebar from './Components/Sidebar';          
import './Components/Sidebar.css';
=======
import { Search, Filter, ChevronDown } from 'lucide-react';
import Sidebar from './Components/Sidebar';          
import './Components/Sidebar.css';
import './LeaveRequests.css';
>>>>>>> sanjana
=======
import { Search, Filter, ChevronDown, Calendar, User, Clock } from 'lucide-react';
>>>>>>> sanjana

const LeaveManagement = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Requests');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  // Sample data - in real app, this would come from your backend
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      name: 'Sanjana Afreen',
      duration: 5,
      startDate: '22/04/2022',
      endDate: '28/04/2022',
      type: 'Sick',
      status: 'Pending',
      approvedBy: null,
      approvedDate: null,
      reason: 'Medical treatment required'
    },
    {
      id: 2,
      name: 'Israt Risha Ivey',
      duration: 7,
      startDate: '22/04/2022',
      endDate: '30/04/2022',
      type: 'Emergency',
      status: 'Approved',
      approvedBy: 'Admin',
      approvedDate: '20/04/2022',
      reason: 'Family emergency'
    },
    {
      id: 3,
      name: 'Zannatul Adon Sabiha',
      duration: 120,
      startDate: '22/04/2022',
      endDate: '28/06/2022',
      type: 'Maternity',
      status: 'Approved',
      approvedBy: 'HR Manager',
      approvedDate: '15/04/2022',
      reason: 'Maternity leave'
    },
    {
      id: 4,
      name: 'Yusha Mahmud',
      duration: 5,
      startDate: '22/04/2022',
      endDate: '28/04/2022',
      type: 'Sick',
      status: 'Pending',
      approvedBy: null,
      approvedDate: null,
      reason: 'Flu symptoms'
    },
    {
      id: 5,
      name: 'Nazia Afreen',
      duration: 5,
      startDate: '22/04/2022',
      endDate: '28/04/2022',
      type: 'Emergency',
      status: 'Declined',
      approvedBy: 'Admin',
      approvedDate: '21/04/2022',
      reason: 'Personal emergency'
    },
    {
      id: 6,
      name: 'Ishmam Mahmud',
      duration: 5,
      startDate: '22/04/2022',
      endDate: '28/04/2022',
      type: 'Annual',
      status: 'Declined',
      approvedBy: 'HR Manager',
      approvedDate: '19/04/2022',
      reason: 'Vacation'
    },
    {
      id: 7,
      name: 'Mahmud Rashed',
      duration: 5,
      startDate: '22/04/2022',
      endDate: '28/04/2022',
      type: 'Sick',
      status: 'Pending',
      approvedBy: null,
      approvedDate: null,
      reason: 'Medical checkup'
    }
  ]);

<<<<<<< HEAD
  const styles = {
    // Main container now uses flex to accommodate sidebar
    appContainer: {
      display: 'flex',
      minHeight: '100vh'
    },
    container: {
      flex: 1,
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
      marginLeft: '220px' // Account for fixed sidebar width
    },
    navbar: {
      backgroundColor: '#0C3D4A',
      borderBottom: '1px solid #e5e7eb',
      padding: '1rem 1.5rem'
    },
    navContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    navLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '2rem'
    },
    navLink: {
      color: 'white',
      fontWeight: '500',
      textDecoration: 'none',
      cursor: 'pointer'
    },
    navLinkHover: {
      color: '#fbbf24'
    },
    header: {
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '1rem 1.5rem'
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    selectContainer: {
      position: 'relative'
    },
    select: {
      backgroundColor: '#0C3D4A',
      color: 'white',
      padding: '0.5rem 2rem 0.5rem 1rem',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      border: 'none',
      outline: 'none',
      appearance: 'none',
      cursor: 'pointer'
    },
    selectArrow: {
      position: 'absolute',
      right: '0.5rem',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '1rem',
      height: '1rem',
      color: 'white',
      pointerEvents: 'none'
    },
    mainContent: {
      padding: '1.5rem'
    },
    pageHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '1.5rem'
    },
    blackSquare: {
      width: '1.5rem',
      height: '1.5rem',
      backgroundColor: 'black'
    },
    pageTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#111827'
    },
    tabs: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1.5rem'
    },
    tab: {
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      fontWeight: '500',
      fontSize: '0.875rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    activeTab: {
      backgroundColor: '#fbbf24',
      color: 'black'
    },
    inactiveTab: {
      backgroundColor: '#0C3D4A',
      color: 'white'
    },
    contentArea: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
    },
    tableHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem',
      borderBottom: '1px solid #e5e7eb'
    },
    tableHeaderLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    tableTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#111827'
    },
    historyButton: {
      backgroundColor: '#0C3D4A',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    tableHeaderRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    searchContainer: {
      position: 'relative'
    },
    searchInput: {
      paddingLeft: '2.5rem',
      paddingRight: '1rem',
      paddingTop: '0.5rem',
      paddingBottom: '0.5rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      outline: 'none',
      width: '16rem',
      transition: 'all 0.2s'
    },
    searchIcon: {
      position: 'absolute',
      left: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '1rem',
      height: '1rem',
      color: '#9ca3af'
    },
    filterButton: {
      padding: '0.5rem',
      color: '#9ca3af',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      transition: 'color 0.2s'
    },
    dropdown: {
      position: 'absolute',
      right: 0,
      marginTop: '0.25rem',
      width: '8rem',
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '0.375rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      zIndex: 10
    },
    dropdownItem: {
      width: '100%',
      textAlign: 'left',
      padding: '0.5rem 0.75rem',
      fontSize: '0.875rem',
      color: '#0C3D4A',
      fontWeight: '500',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    table: {
      width: '100%',
      overflowX: 'auto'
    },
    tableElement: {
      width: '100%'
    },
    tableHead: {
      backgroundColor: '#f9fafb'
    },
    tableHeaderCell: {
      padding: '0.75rem 1.5rem',
      textAlign: 'left',
      fontSize: '0.75rem',
      fontWeight: '500',
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    tableBody: {
      backgroundColor: 'white'
    },
    tableRow: {
      borderBottom: '1px solid #e5e7eb',
      transition: 'background-color 0.2s'
    },
    tableRowHover: {
      backgroundColor: '#f9fafb'
    },
    tableCell: {
      padding: '1rem 1.5rem',
      whiteSpace: 'nowrap',
      fontSize: '0.875rem',
      color: '#111827'
    },
    statusBadge: {
      padding: '0.25rem 0.5rem',
      fontSize: '0.75rem',
      fontWeight: '600',
      borderRadius: '9999px'
    },
    statusApproved: {
      backgroundColor: '#dcfce7',
      color: '#166534'
    },
    statusDeclined: {
      backgroundColor: '#fee2e2',
      color: '#991b1b'
    },
    statusPending: {
      backgroundColor: '#fef3c7',
      color: '#92400e'
    },
    actionButtons: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem'
    },
    actionButton: {
      padding: '0.25rem 0.75rem',
      borderRadius: '0.25rem',
      fontSize: '0.75rem',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    approveButton: {
      backgroundColor: '#059669',
      color: 'white'
    },
    declineButton: {
      backgroundColor: '#dc2626',
      color: 'white'
    },
    detailsButton: {
      backgroundColor: '#0C3D4A',
      color: 'white'
    },
    actionsDropdown: {
      position: 'relative'
    },
    actionsButton: {
      backgroundColor: '#0C3D4A',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      transition: 'background-color 0.2s'
    }
  };

  const getStatusColor = (status) => {
=======
  const getStatusClass = (status) => {
>>>>>>> sanjana
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

  const getTypeColor = (type) => {
    switch (type) {
      case 'Sick':
        return '#ef4444';
      case 'Emergency':
        return '#f59e0b';
      case 'Maternity':
        return '#8b5cf6';
      case 'Annual':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const handleAction = (action, requestId) => {
    if (action === 'approve') {
      setLeaveRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { 
                ...req, 
                status: 'Approved', 
                approvedBy: 'Admin', 
                approvedDate: new Date().toLocaleDateString('en-GB') 
              }
            : req
        )
      );
    } else if (action === 'decline') {
      setLeaveRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { 
                ...req, 
                status: 'Declined', 
                approvedBy: 'Admin', 
                approvedDate: new Date().toLocaleDateString('en-GB') 
              }
            : req
        )
      );
    }
    console.log(`${action} action for request ${requestId}`);
  };

  const ActionButton = ({ status, requestId }) => {
    if (status === 'Pending') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', minWidth: '120px' }}>
          <button 
            onClick={() => handleAction('approve', requestId)}
            style={{
              padding: '0.375rem 0.75rem',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'center',
              minHeight: '28px',
              backgroundColor: '#059669',
              color: 'white'
            }}
          >
            Approve
          </button>
          <button 
            onClick={() => handleAction('decline', requestId)}
            style={{
              padding: '0.375rem 0.75rem',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'center',
              minHeight: '28px',
              backgroundColor: '#dc2626',
              color: 'white'
            }}
          >
            Decline
          </button>
          <button 
            style={{
              padding: '0.375rem 0.75rem',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'center',
              minHeight: '28px',
              backgroundColor: '#0C3D4A',
              color: 'white'
            }}
          >
            View Details
          </button>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', minWidth: '120px' }}>
        <button 
          style={{
            padding: '0.375rem 0.75rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textAlign: 'center',
            minHeight: '28px',
            backgroundColor: '#0C3D4A',
            color: 'white'
          }}
        >
          View Details
        </button>
      </div>
    );
  };

  // Filter requests based on active tab
  const getFilteredRequests = () => {
    let requests = leaveRequests;
    
    if (activeTab === 'history') {
      // Show only approved requests in history
      requests = requests.filter(req => req.status === 'Approved');
    }
    
    // Apply search filter
    requests = requests.filter(request => 
      request.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Apply status filter (only for requests tab)
    if (activeTab === 'requests') {
      if (selectedFilter !== 'All Requests') {
        requests = requests.filter(request => request.status === selectedFilter);
      }
    }
    
    return requests;
  };

  const filteredRequests = getFilteredRequests();

  // Stats for history page
  const getHistoryStats = () => {
    const approvedRequests = leaveRequests.filter(req => req.status === 'Approved');
    const pendingRequests = leaveRequests.filter(req => req.status === 'Pending');
    
    // Get most common leave type among approved requests
    const typeCounts = approvedRequests.reduce((acc, req) => {
      acc[req.type] = (acc[req.type] || 0) + 1;
      return acc;
    }, {});
    const mostCommonType = Object.keys(typeCounts).reduce((a, b) => 
      typeCounts[a] > typeCounts[b] ? a : b, 'None'
    );
    
    return {
      totalApproved: approvedRequests.length,
      pendingRequests: pendingRequests.length,
      mostCommonType: approvedRequests.length > 0 ? mostCommonType : 'None'
    };
  };

  const stats = getHistoryStats();

  return (
<<<<<<< HEAD
<<<<<<< HEAD
    <div style={styles.appContainer}>
=======
    <div className="app-container">
>>>>>>> sanjana
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />
      
      {/* Main Content */}
<<<<<<< HEAD
      <div style={styles.container}>
        {/* Navigation Bar */}
        <nav style={styles.navbar}>
          <div style={styles.navContent}>
            <div style={styles.navLinks}>
              <a 
                href="#" 
                style={styles.navLink}
                onMouseEnter={(e) => e.target.style.color = '#fbbf24'}
                onMouseLeave={(e) => e.target.style.color = 'white'}
              >
                Home
              </a>
              <a 
                href="#" 
                style={styles.navLink}
                onMouseEnter={(e) => e.target.style.color = '#fbbf24'}
                onMouseLeave={(e) => e.target.style.color = 'white'}
              >
                About
              </a>
              <a 
                href="#" 
                style={styles.navLink}
                onMouseEnter={(e) => e.target.style.color = '#fbbf24'}
                onMouseLeave={(e) => e.target.style.color = 'white'}
              >
                Contacts
              </a>
              <a 
                href="#" 
                style={styles.navLink}
                onMouseEnter={(e) => e.target.style.color = '#fbbf24'}
                onMouseLeave={(e) => e.target.style.color = 'white'}
              >
                Login
              </a>
=======
      <div className="main-container">
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="nav-content">
            <div className="nav-links">
              <button className="nav-link">Home</button>
              <button className="nav-link">About</button>
              <button className="nav-link">Contacts</button>
              <button className="nav-link">Login</button>
>>>>>>> sanjana
            </div>
          </div>
        </nav>

        {/* Header */}
<<<<<<< HEAD
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.headerLeft}>
=======
        <div className="header">
          <div className="header-content">
            <div className="header-left">
>>>>>>> sanjana
=======
    <div style={{ padding: '1.5rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <div style={{ width: '1.5rem', height: '1.5rem', backgroundColor: 'black' }}></div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>Leave Management</h1>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('requests')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            fontWeight: '500',
            fontSize: '0.875rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            backgroundColor: activeTab === 'requests' ? '#fbbf24' : '#0C3D4A',
            color: activeTab === 'requests' ? 'black' : 'white'
          }}
        >
          Leave Requests
        </button>
        <button
          onClick={() => setActiveTab('history')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            fontWeight: '500',
            fontSize: '0.875rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            backgroundColor: activeTab === 'history' ? '#fbbf24' : '#0C3D4A',
            color: activeTab === 'history' ? 'black' : 'white'
          }}
        >
          Leave History
        </button>
      </div>

      {/* Stats Cards for History */}
      {activeTab === 'history' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '0.5rem', backgroundColor: '#dcfce7', borderRadius: '0.5rem' }}>
                <User size={20} color="#166534" />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Total Approved</p>
                <p style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', margin: 0 }}>{stats.totalApproved}</p>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '0.5rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem' }}>
                <Clock size={20} color="#92400e" />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Pending Review</p>
                <p style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', margin: 0 }}>{stats.pendingRequests}</p>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '0.5rem', backgroundColor: '#e0e7ff', borderRadius: '0.5rem' }}>
                <Calendar size={20} color="#3730a3" />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Most Common</p>
                <p style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', margin: 0 }}>{stats.mostCommonType}</p>
              </div>
>>>>>>> sanjana
            </div>
          </div>
        </div>
      )}

<<<<<<< HEAD
        {/* Main Content */}
<<<<<<< HEAD
        <div style={styles.mainContent}>
          {/* Leave Management Header */}
          <div style={styles.pageHeader}>
            <div style={styles.blackSquare}></div>
            <h1 style={styles.pageTitle}>Leave Management</h1>
          </div>

          {/* Navigation Tabs */}
          <div style={styles.tabs}>
            <button
              onClick={() => setActiveTab('requests')}
              style={{
                ...styles.tab,
                ...(activeTab === 'requests' ? styles.activeTab : styles.inactiveTab)
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'requests') {
                  e.target.style.backgroundColor = 'rgba(12, 61, 74, 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'requests') {
                  e.target.style.backgroundColor = '#0C3D4A';
                }
              }}
=======
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
>>>>>>> sanjana
            >
              Leave Requests
            </button>
            <button
              onClick={() => setActiveTab('history')}
<<<<<<< HEAD
              style={{
                ...styles.tab,
                ...(activeTab === 'history' ? styles.activeTab : styles.inactiveTab)
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'history') {
                  e.target.style.backgroundColor = 'rgba(12, 61, 74, 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'history') {
                  e.target.style.backgroundColor = '#0C3D4A';
                }
              }}
=======
              className={`tab ${activeTab === 'history' ? 'active' : 'inactive'}`}
>>>>>>> sanjana
            >
              Leave History
            </button>
          </div>

          {/* Content Area */}
<<<<<<< HEAD
          <div style={styles.contentArea}>
            {/* Table Header */}
            <div style={styles.tableHeader}>
              <div style={styles.tableHeaderLeft}>
                <h2 style={styles.tableTitle}>Leave Requests</h2>
              </div>
              <div style={styles.tableHeaderRight}>
                <div style={styles.searchContainer}>
                  <Search style={styles.searchIcon} />
=======
          <div className="content-area">
            {/* Table Header */}
            <div className="table-header">
              <div className="table-header-left">
                <h2 className="table-title">Leave Requests</h2>
              </div>
              <div className="table-header-right">
                <div className="search-container">
                  <Search className="search-icon" />
>>>>>>> sanjana
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
<<<<<<< HEAD
                    style={styles.searchInput}
                    onFocus={(e) => {
                      e.target.style.outline = '2px solid #0C3D4A';
                      e.target.style.borderColor = 'transparent';
                    }}
                    onBlur={(e) => {
                      e.target.style.outline = 'none';
                      e.target.style.borderColor = '#d1d5db';
                    }}
=======
                    className="search-input"
>>>>>>> sanjana
                  />
                </div>
                <div style={{ position: 'relative' }}>
                  <button 
                    onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
<<<<<<< HEAD
                    style={styles.filterButton}
                    onMouseEnter={(e) => e.target.style.color = '#6b7280'}
                    onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
=======
                    className="filter-button"
>>>>>>> sanjana
                  >
                    <Filter style={{ width: '1.25rem', height: '1.25rem' }} />
                  </button>
                  {filterDropdownOpen && (
<<<<<<< HEAD
                    <div style={styles.dropdown}>
=======
                    <div className="dropdown">
>>>>>>> sanjana
                      <button 
                        onClick={() => {
                          setSelectedFilter('All Requests');
                          setFilterDropdownOpen(false);
                        }}
<<<<<<< HEAD
                        style={styles.dropdownItem}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#0C3D4A';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#0C3D4A';
                        }}
=======
                        className="dropdown-item"
>>>>>>> sanjana
                      >
                        All Requests
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedFilter('Pending');
                          setFilterDropdownOpen(false);
                        }}
<<<<<<< HEAD
                        style={styles.dropdownItem}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#0C3D4A';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#0C3D4A';
                        }}
=======
                        className="dropdown-item"
>>>>>>> sanjana
                      >
                        Pending
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedFilter('Approved');
                          setFilterDropdownOpen(false);
                        }}
<<<<<<< HEAD
                        style={styles.dropdownItem}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#0C3D4A';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#0C3D4A';
                        }}
=======
                        className="dropdown-item"
>>>>>>> sanjana
                      >
                        Approved
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedFilter('Declined');
                          setFilterDropdownOpen(false);
                        }}
<<<<<<< HEAD
                        style={styles.dropdownItem}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#0C3D4A';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#0C3D4A';
                        }}
=======
                        className="dropdown-item"
>>>>>>> sanjana
                      >
                        Declined
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
<<<<<<< HEAD
            <div style={styles.table}>
              <table style={styles.tableElement}>
                <thead style={styles.tableHead}>
                  <tr>
                    <th style={styles.tableHeaderCell}>Name(s)</th>
                    <th style={styles.tableHeaderCell}>Duration(s)</th>
                    <th style={styles.tableHeaderCell}>Start Date</th>
                    <th style={styles.tableHeaderCell}>End Date</th>
                    <th style={styles.tableHeaderCell}>Type</th>
                    <th style={styles.tableHeaderCell}>Status</th>
                    <th style={styles.tableHeaderCell}>Actions</th>
                  </tr>
                </thead>
                <tbody style={styles.tableBody}>
                  {filteredRequests.map((request) => (
                    <tr 
                      key={request.id} 
                      style={styles.tableRow}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      <td style={styles.tableCell}>{request.name}</td>
                      <td style={styles.tableCell}>{request.duration}</td>
                      <td style={styles.tableCell}>{request.startDate}</td>
                      <td style={styles.tableCell}>{request.endDate}</td>
                      <td style={styles.tableCell}>{request.type}</td>
                      <td style={styles.tableCell}>
                        <span style={{...styles.statusBadge, ...getStatusColor(request.status)}}>
                          {request.status}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
=======
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
>>>>>>> sanjana
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
=======
      {/* Content Area */}
      <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        {/* Table Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '1rem', 
          borderBottom: '1px solid #e5e7eb' 
        }}>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>
              {activeTab === 'requests' ? 'Leave Requests' : 'Leave History'}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ 
                position: 'absolute', 
                left: '0.75rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                width: '1rem', 
                height: '1rem', 
                color: '#9ca3af' 
              }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  paddingLeft: '2.5rem',
                  paddingRight: '1rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  width: '16rem'
                }}
              />
            </div>
            {activeTab === 'requests' && (
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                  style={{
                    padding: '0.5rem',
                    color: '#9ca3af',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Filter style={{ width: '1.25rem', height: '1.25rem' }} />
                </button>
                {filterDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    marginTop: '0.25rem',
                    width: '8rem',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    zIndex: 10
                  }}>
                    {['All Requests', 'Pending', 'Approved', 'Declined'].map(filter => (
                      <button 
                        key={filter}
                        onClick={() => {
                          setSelectedFilter(filter);
                          setFilterDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.5rem 0.75rem',
                          fontSize: '0.875rem',
                          color: '#0C3D4A',
                          fontWeight: '500',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={{ 
                  padding: '0.75rem 1.5rem', 
                  textAlign: 'left', 
                  fontSize: '0.75rem', 
                  fontWeight: '500', 
                  color: '#6b7280', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em' 
                }}>
                  Name(s)
                </th>
                <th style={{ 
                  padding: '0.75rem 1.5rem', 
                  textAlign: 'left', 
                  fontSize: '0.75rem', 
                  fontWeight: '500', 
                  color: '#6b7280', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em' 
                }}>
                  Duration(s)
                </th>
                <th style={{ 
                  padding: '0.75rem 1.5rem', 
                  textAlign: 'left', 
                  fontSize: '0.75rem', 
                  fontWeight: '500', 
                  color: '#6b7280', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em' 
                }}>
                  Start Date
                </th>
                <th style={{ 
                  padding: '0.75rem 1.5rem', 
                  textAlign: 'left', 
                  fontSize: '0.75rem', 
                  fontWeight: '500', 
                  color: '#6b7280', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em' 
                }}>
                  End Date
                </th>
                <th style={{ 
                  padding: '0.75rem 1.5rem', 
                  textAlign: 'left', 
                  fontSize: '0.75rem', 
                  fontWeight: '500', 
                  color: '#6b7280', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em' 
                }}>
                  Type
                </th>
                <th style={{ 
                  padding: '0.75rem 1.5rem', 
                  textAlign: 'left', 
                  fontSize: '0.75rem', 
                  fontWeight: '500', 
                  color: '#6b7280', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em' 
                }}>
                  Status
                </th>
                {activeTab === 'history' && (
                  <th style={{ 
                    padding: '0.75rem 1.5rem', 
                    textAlign: 'left', 
                    fontSize: '0.75rem', 
                    fontWeight: '500', 
                    color: '#6b7280', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em' 
                  }}>
                    Approved By
                  </th>
                )}
                {activeTab === 'history' && (
                  <th style={{ 
                    padding: '0.75rem 1.5rem', 
                    textAlign: 'left', 
                    fontSize: '0.75rem', 
                    fontWeight: '500', 
                    color: '#6b7280', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em' 
                  }}>
                    Approved Date
                  </th>
                )}
                {activeTab === 'requests' && (
                  <th style={{ 
                    padding: '0.75rem 1.5rem', 
                    textAlign: 'left', 
                    fontSize: '0.75rem', 
                    fontWeight: '500', 
                    color: '#6b7280', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em',
                    width: '140px'
                  }}>
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody style={{ backgroundColor: 'white' }}>
              {filteredRequests.map((request) => (
                <tr key={request.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#111827' }}>
                    {request.name}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#111827' }}>
                    {request.duration} days
                  </td>
                  <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#111827' }}>
                    {request.startDate}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#111827' }}>
                    {request.endDate}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#111827' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      backgroundColor: getTypeColor(request.type) + '20',
                      color: getTypeColor(request.type),
                      border: `1px solid ${getTypeColor(request.type)}40`
                    }}>
                      {request.type}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#111827' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      borderRadius: '9999px',
                      backgroundColor: request.status === 'Approved' ? '#dcfce7' : 
                                    request.status === 'Declined' ? '#fee2e2' : '#fef3c7',
                      color: request.status === 'Approved' ? '#166534' : 
                             request.status === 'Declined' ? '#991b1b' : '#92400e'
                    }}>
                      {request.status}
                    </span>
                  </td>
                  {activeTab === 'history' && (
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#111827' }}>
                      {request.approvedBy || '-'}
                    </td>
                  )}
                  {activeTab === 'history' && (
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#111827' }}>
                      {request.approvedDate || '-'}
                    </td>
                  )}
                  {activeTab === 'requests' && (
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#111827', width: '140px' }}>
                      <ActionButton 
                        status={request.status}
                        requestId={request.id}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
>>>>>>> sanjana
        </div>

        {/* Empty State */}
        {filteredRequests.length === 0 && (
          <div style={{ 
            padding: '3rem', 
            textAlign: 'center', 
            color: '#6b7280' 
          }}>
            <Calendar size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>
              No {activeTab === 'history' ? 'approved requests' : 'requests'} found
            </p>
            <p style={{ fontSize: '0.875rem' }}>
              {activeTab === 'history' 
                ? 'When leave requests are approved, they will appear here.'
                : 'Try adjusting your search or filters.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveManagement;