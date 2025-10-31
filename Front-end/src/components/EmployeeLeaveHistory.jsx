import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Plus } from 'lucide-react';
import './LeaveRequests.css';

const EmployeeLeaveHistory = () => {
  const navigate = useNavigate();
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchLeaveHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/leave/my-requests', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error("Failed to fetch leave history");
      const data = await response.json();

      // Transform API response into expected format
      const formatted = data.map(l => {
        const start = new Date(l.startDate);
        const end = new Date(l.endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        return {
          id: l.id,
          type: l.leaveType,
          startDate: l.startDate,
          endDate: l.endDate,
          days,
          status: l.status,
          reason: l.reason
        };
      });

      setLeaveHistory(formatted);
    } catch (error) {
      console.error('Error fetching leave history:', error);
      setLeaveHistory([]); // no dummy fallback
    } finally {
      setLoading(false);
    }
  };

  fetchLeaveHistory();
}, []);


  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'approved';
      case 'pending':
        return 'pending';
      case 'rejected':
      case 'declined':
        return 'declined';
      default:
        return '';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Sick Leave':
        return '#ef4444';
      case 'Emergency Leave':
        return '#f59e0b';
      case 'Maternity Leave':
        return '#8b5cf6';
      case 'Annual Leave':
        return '#10b981';
      case 'Paternity Leave':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const handleApplyForLeave = () => {
    navigate('/leave-application');
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading-state">
          <p>Loading leave history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* Header Section */}
      <div className="page-header-with-action">
        <div className="page-header">
          <div className="black-square"></div>
          <h1 className="page-title">Leave History</h1>
        </div>
        <button className="apply-leave-btn-enhanced" onClick={handleApplyForLeave}>
          <Plus size={18} />
          Apply for Leave
        </button>
      </div>

      {leaveHistory.length === 0 ? (
        <div className="content-area">
          <div className="no-history">
            <Calendar size={48} className="empty-icon" />
            <p className="empty-title">No leave history found.</p>
            <p className="empty-subtitle">Start by applying for your first leave request.</p>
            <button className="apply-leave-btn-enhanced" onClick={handleApplyForLeave}>
              <Plus size={18} />
              Apply for Your First Leave
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Leave Summary Cards - Above the table */}
{/* Leave Summary Cards - Above the table */}
<div className="summary-cards-container">
  {/* Total Approved Days */}
  <div className="summary-card-item">
    <div className="summary-card-icon approved-bg">
      <User size={24} />
    </div>
    <div className="summary-card-content">
      <span className="summary-card-label">Total Leaves Taken</span>
      <span className="summary-card-value">
        {leaveHistory
          .filter(l => l.status.toLowerCase() === 'approved')
          .reduce((sum, l) => sum + l.days, 0)} days
      </span>
    </div>
  </div>

  {/* Pending Requests */}
  <div className="summary-card-item">
    <div className="summary-card-icon pending-bg">
      <Clock size={24} />
    </div>
    <div className="summary-card-content">
      <span className="summary-card-label">Pending Requests</span>
      <span className="summary-card-value">
        {leaveHistory.filter(l => l.status.toLowerCase() === 'pending').length}
      </span>
    </div>
  </div>

  {/* Rejected / Declined Requests */}
  <div className="summary-card-item">
    <div className="summary-card-icon rejected-bg">
      <Calendar size={24} />
    </div>
    <div className="summary-card-content">
      <span className="summary-card-label">Rejected Requests</span>
      <span className="summary-card-value">
        {leaveHistory.filter(l => 
          ['rejected', 'declined'].includes(l.status.toLowerCase())
        ).length}
      </span>
    </div>
  </div>
</div>

          {/* Content Area with Table */}
          <div className="content-area">
            {/* Table Header */}
            <div className="table-header">
              <div className="table-header-left">
           <h2 className="table-title" style={{ color: "white" }}>
  Your Leave History
</h2>

              </div>
            </div>

            {/* Table */}
            <div className="table-container">
              <table className="table">
                <thead className="table-head">
                  <tr>
                    <th className="table-header-cell">Leave Type</th>
                    <th className="table-header-cell">Start Date</th>
                    <th className="table-header-cell">End Date</th>
                    <th className="table-header-cell">Days</th>
                    <th className="table-header-cell">Status</th>
                    <th className="table-header-cell">Reason</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {leaveHistory.map((leave) => (
                    <tr key={leave.id} className="table-row">
                      <td className="table-cell">
                        <span className="leave-type-badge" style={{
                          backgroundColor: getTypeColor(leave.type) + '20',
                          color: getTypeColor(leave.type),
                          border: `1px solid ${getTypeColor(leave.type)}40`
                        }}>
                          {leave.type}
                        </span>
                      </td>
                      <td className="table-cell">{new Date(leave.startDate).toLocaleDateString()}</td>
                      <td className="table-cell">{new Date(leave.endDate).toLocaleDateString()}</td>
                      <td className="table-cell">{leave.days}</td>
                      <td className="table-cell">
                        <span className={`status-badge ${getStatusClass(leave.status)}`}>
                          {leave.status}
                        </span>
                      </td>
                      <td className="table-cell">{leave.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeeLeaveHistory;