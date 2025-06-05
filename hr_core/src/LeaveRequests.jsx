import React, { useState } from 'react';
import { Search, Filter, ChevronDown, Menu } from 'lucide-react';

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

  const styles = {
    container: {
      flex: 1,
      backgroundColor: '#f9fafb',
      minHeight: '100vh'
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
    switch (status) {
      case 'Approved':
        return styles.statusApproved;
      case 'Declined':
        return styles.statusDeclined;
      case 'Pending':
        return styles.statusPending;
      default:
        return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  const ActionButton = ({ status, requestId }) => {
    const isOpen = openDropdown === requestId;
    
    if (status === 'Pending') {
      return (
        <div style={styles.actionButtons}>
          <button 
            onClick={() => handleAction('approve', requestId)}
            style={{...styles.actionButton, ...styles.approveButton}}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#047857'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#059669'}
          >
            Approve
          </button>
          <button 
            onClick={() => handleAction('decline', requestId)}
            style={{...styles.actionButton, ...styles.declineButton}}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
          >
            Decline
          </button>
          <button 
            onClick={() => handleAction('details', requestId)}
            style={{...styles.actionButton, ...styles.detailsButton}}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(12, 61, 74, 0.8)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#0C3D4A'}
          >
            View Details
          </button>
        </div>
      );
    }

    if (status === 'Approved' || status === 'Declined') {
      return (
        <button 
          onClick={() => handleAction('details', requestId)}
          style={{...styles.actionButton, ...styles.detailsButton}}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(12, 61, 74, 0.8)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#0C3D4A'}
        >
          View Details
        </button>
      );
    }

    return (
      <div style={styles.actionsDropdown}>
        <button 
          onClick={() => setOpenDropdown(isOpen ? null : requestId)}
          style={styles.actionsButton}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(12, 61, 74, 0.8)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#0C3D4A'}
        >
          Actions
          <ChevronDown style={{ width: '1rem', height: '1rem' }} />
        </button>
        {isOpen && (
          <div style={styles.dropdown}>
            <button 
              onClick={() => {
                handleAction('details', requestId);
                setOpenDropdown(null);
              }}
              style={styles.dropdownItem}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#0C3D4A';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#0C3D4A';
              }}
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

  return (
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
          </div>
        </div>
      </nav>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
          </div>
        </div>
      </div>

      {/* Main Content */}
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
          >
            Leave Requests
          </button>
          <button
            onClick={() => setActiveTab('history')}
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
          >
            Leave History
          </button>
        </div>

        {/* Content Area */}
        <div style={styles.contentArea}>
          {/* Table Header */}
          <div style={styles.tableHeader}>
            <div style={styles.tableHeaderLeft}>
              <h2 style={styles.tableTitle}>Leave Requests</h2>
            </div>
            <div style={styles.tableHeaderRight}>
              <div style={styles.searchContainer}>
                <Search style={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.searchInput}
                  onFocus={(e) => {
                    e.target.style.outline = '2px solid #0C3D4A';
                    e.target.style.borderColor = 'transparent';
                  }}
                  onBlur={(e) => {
                    e.target.style.outline = 'none';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                  style={styles.filterButton}
                  onMouseEnter={(e) => e.target.style.color = '#6b7280'}
                  onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                >
                  <Filter style={{ width: '1.25rem', height: '1.25rem' }} />
                </button>
                {filterDropdownOpen && (
                  <div style={styles.dropdown}>
                    <button 
                      onClick={() => {
                        setSelectedFilter('All Requests');
                        setFilterDropdownOpen(false);
                      }}
                      style={styles.dropdownItem}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#0C3D4A';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#0C3D4A';
                      }}
                    >
                      All Requests
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedFilter('Pending');
                        setFilterDropdownOpen(false);
                      }}
                      style={styles.dropdownItem}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#0C3D4A';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#0C3D4A';
                      }}
                    >
                      Pending
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedFilter('Approved');
                        setFilterDropdownOpen(false);
                      }}
                      style={styles.dropdownItem}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#0C3D4A';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#0C3D4A';
                      }}
                    >
                      Approved
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedFilter('Declined');
                        setFilterDropdownOpen(false);
                      }}
                      style={styles.dropdownItem}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#0C3D4A';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#0C3D4A';
                      }}
                    >
                      Declined
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
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
  );
};

export default LeaveRequestsPage;