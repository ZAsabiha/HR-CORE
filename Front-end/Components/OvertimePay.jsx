import React, { useState, useEffect, useMemo } from 'react';
import { Search, Download, Calendar, Filter, Clock, Users, TrendingUp, DollarSign, Menu, ChevronDown } from 'lucide-react';
import './OvertimePay.css';

const OvertimePay = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateRange, setDateRange] = useState('this_month');
  
  // Backend data states
  const [overtimeData, setOvertimeData] = useState([]);
  const [departments, setDepartments] = useState(['all']);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState({ 
    totalEmployees: 0, 
    eligibleForOvertime: 0, 
    totalOvertimeHours: '0.0', 
    totalOvertimePay: '0.00' 
  });

  // Fetch departments for dropdown
  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/salaries/dropdown/departments', {
        credentials: 'include'
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const depts = ['all', ...result.data.map(dept => dept.name)];
          setDepartments(depts);
        }
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  // Fetch overtime data from backend
  const fetchOvertimeData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (selectedDepartment !== 'all') params.append('department', selectedDepartment);
      
      // Date range logic
      const today = new Date();
      if (dateRange === 'today') {
        params.append('startDate', today.toISOString().split('T')[0]);
        params.append('endDate', today.toISOString().split('T')[0]);
      } else if (dateRange === 'yesterday') {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        params.append('startDate', yesterday.toISOString().split('T')[0]);
        params.append('endDate', yesterday.toISOString().split('T')[0]);
      } else if (dateRange === 'this_week') {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        params.append('startDate', weekStart.toISOString().split('T')[0]);
        params.append('endDate', today.toISOString().split('T')[0]);
      } else if (dateRange === 'last_week') {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay() - 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        params.append('startDate', weekStart.toISOString().split('T')[0]);
        params.append('endDate', weekEnd.toISOString().split('T')[0]);
      } else if (dateRange === 'this_month') {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        params.append('startDate', monthStart.toISOString().split('T')[0]);
        params.append('endDate', today.toISOString().split('T')[0]);
      }

      const response = await fetch(`http://localhost:5000/api/salaries/overtime/data?${params}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setOvertimeData(result.data);
          setStats({
            totalEmployees: result.stats.totalEmployees,
            eligibleForOvertime: result.stats.totalEmployees, // All records have overtime
            totalOvertimeHours: result.stats.totalOvertimeHours.toString(),
            totalOvertimePay: result.stats.totalOvertimePay.toString()
          });
          setPagination(result.pagination);
        }
      }
    } catch (error) {
      console.error('Error fetching overtime data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and filter changes
  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchOvertimeData();
  }, [selectedDepartment, dateRange]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return overtimeData;
    
    return overtimeData.filter(record => {
      const employeeName = record.employeeName?.toLowerCase() || '';
      const search = searchTerm.toLowerCase();
      return employeeName.includes(search);
    });
  }, [overtimeData, searchTerm]);

  // Apply status filter
  const statusFilteredData = useMemo(() => {
    if (selectedStatus === 'all') return filteredData;
    
    return filteredData.filter(record => {
      if (selectedStatus === 'high' && record.overtimeHours > 4) return true;
      if (selectedStatus === 'medium' && record.overtimeHours > 2 && record.overtimeHours <= 4) return true;
      if (selectedStatus === 'low' && record.overtimeHours > 0 && record.overtimeHours <= 2) return true;
      return false;
    });
  }, [filteredData, selectedStatus]);

  const getOvertimeStatus = (overtimeHours) => {
    if (overtimeHours > 4) return 'high';
    if (overtimeHours > 2) return 'medium';
    if (overtimeHours > 0) return 'low';
    return 'none';
  };

  const getStatusBadge = (overtimeHours) => {
    const status = getOvertimeStatus(overtimeHours);
    const statusClasses = {
      high: 'status-high',
      medium: 'status-medium',
      low: 'status-low',
      none: 'status-none'
    };

    const statusLabels = {
      high: 'High OT',
      medium: 'Medium OT',
      low: 'Low OT',
      none: 'No OT'
    };

    return (
      <span className={`status-badge ${statusClasses[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };

  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return '--:--';
    return new Date(dateTimeString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '--';
    return new Date(dateString).toLocaleDateString();
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedDepartment !== 'all') params.append('department', selectedDepartment);
      
      // Add date range
      const today = new Date();
      if (dateRange === 'this_month') {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        params.append('startDate', monthStart.toISOString().split('T')[0]);
        params.append('endDate', today.toISOString().split('T')[0]);
      }

      // Create CSV content
      const headers = ['Date', 'Employee', 'Department', 'Clock In', 'Clock Out', 'Regular Hours', 'Overtime Hours', 'Regular Pay ($)', 'Overtime Pay ($)', 'Total Pay ($)', 'Status'];
      const csvContent = [
        headers.join(','),
        ...statusFilteredData.map(record => [
          formatDate(record.date),
          record.employeeName,
          record.department,
          formatTime(record.checkInTime),
          formatTime(record.checkOutTime),
          record.regularHours,
          record.overtimeHours,
          record.regularPay,
          record.overtimePay,
          record.totalPay,
          getOvertimeStatus(record.overtimeHours).toUpperCase()
        ].map(field => `"${field}"`).join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `overtime_report_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data');
    }
  };

  return (
    <div className="overtime-main-content">
      {/* Page Title */}
      <div className="page-header">
        <h1 className="page-title">Overtime Pay</h1>
      </div>

      <div className="overtime-container">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-blue">
            <div className="stat-content">
              <div className="stat-info">
                <Users className="stat-icon-main" />
                <div className="stat-details">
                  <p className="stat-title">Employees with OT</p>
                  <p className="stat-value">{stats.totalEmployees}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="stat-card stat-green">
            <div className="stat-content">
              <div className="stat-info">
                <Clock className="stat-icon-main" />
                <div className="stat-details">
                  <p className="stat-title">Total Records</p>
                  <p className="stat-value">{statusFilteredData.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="stat-card stat-yellow">
            <div className="stat-content">
              <div className="stat-info">
                <TrendingUp className="stat-icon-main" />
                <div className="stat-details">
                  <p className="stat-title">Total OT Hours</p>
                  <p className="stat-value">{stats.totalOvertimeHours}h</p>
                </div>
              </div>
            </div>
          </div>

          <div className="stat-card stat-red">
            <div className="stat-content">
              <div className="stat-info">
                <DollarSign className="stat-icon-main" />
                <div className="stat-details">
                  <p className="stat-title">Total OT Pay</p>
                  <p className="stat-value">${stats.totalOvertimePay}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="filters-container">
          <div className="filters-row">
            <div className="search-filters">
              {/* Search */}
              <div className="search-box">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Date Range */}
              <select 
                className="filter-select"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="this_week">This Week</option>
                <option value="last_week">Last Week</option>
                <option value="this_month">This Month</option>
              </select>

              {/* Department Filter */}
              <select 
                className="filter-select"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select 
                className="filter-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="high">High OT (>4h)</option>
                <option value="medium">Medium OT (2-4h)</option>
                <option value="low">Low OT (0-2h)</option>
              </select>
            </div>

            {/* Export Button */}
            <button onClick={handleExport} className="export-btn" disabled={loading}>
              <Download className="btn-icon" />
              Export
            </button>
          </div>
        </div>

        {/* Overtime Table */}
        <div className="overtime-table-container">
          <div className="table-wrapper">
            {loading ? (
              <div style={{ 
                padding: '40px', 
                textAlign: 'center', 
                color: '#666' 
              }}>
                Loading overtime data...
              </div>
            ) : (
              <table className="overtime-table">
                <thead className="table-header">
                  <tr>
                    <th className="table-th">Employee</th>
                    <th className="table-th">Date</th>
                    <th className="table-th">Clock In</th>
                    <th className="table-th">Clock Out</th>
                    <th className="table-th">Regular Hours</th>
                    <th className="table-th">OT Hours</th>
                    <th className="table-th">Regular Pay</th>
                    <th className="table-th">OT Pay</th>
                    <th className="table-th">Status</th>
                    <th className="table-th">Location</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {statusFilteredData.map((record) => (
                    <tr key={record.id} className="table-row">
                      <td className="table-td">
                        <div className="employee-info">
                          <div className="employee-avatar">
                            <span className="avatar-text">
                              {record.employeeName?.split(' ').map(n => n[0]).join('') || 'NA'}
                            </span>
                          </div>
                          <div className="employee-details">
                            <div className="employee-name">{record.employeeName}</div>
                            <div className="employee-meta">{record.position} • {record.department}</div>
                          </div>
                        </div>
                      </td>
                      <td className="table-td">{formatDate(record.date)}</td>
                      <td className="table-td table-time">{formatTime(record.checkInTime)}</td>
                      <td className="table-td table-time">{formatTime(record.checkOutTime)}</td>
                      <td className="table-td table-hours">{record.regularHours}h</td>
                      <td className="table-td table-overtime">{record.overtimeHours}h</td>
                      <td className="table-td table-pay">${record.regularPay}</td>
                      <td className="table-td table-overtime-pay">${record.overtimePay}</td>
                      <td className="table-td">{getStatusBadge(record.overtimeHours)}</td>
                      <td className="table-td table-location">{record.location || 'Office'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {!loading && statusFilteredData.length === 0 && (
            <div className="empty-state">
              <div className="empty-title">No overtime records found</div>
              <div className="empty-subtitle">Try adjusting your search or filter criteria</div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {statusFilteredData.length > 0 && (
          <div className="pagination-container">
            <div className="pagination-info">
              Showing <span className="pagination-highlight">1</span> to{' '}
              <span className="pagination-highlight">{statusFilteredData.length}</span> of{' '}
              <span className="pagination-highlight">{pagination.total || statusFilteredData.length}</span> results
            </div>
            <div className="pagination-controls">
              <button className="pagination-btn pagination-btn-disabled" disabled>
                Previous
              </button>
              <button className="pagination-btn pagination-btn-active">
                1
              </button>
              <button className="pagination-btn pagination-btn-disabled" disabled>
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OvertimePay;
