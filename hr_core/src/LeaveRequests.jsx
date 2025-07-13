import React, { useState } from 'react';
import { Search, Filter, ChevronDown, Calendar, User, Clock } from 'lucide-react';

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
            </div>
          </div>
        </div>
      )}

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