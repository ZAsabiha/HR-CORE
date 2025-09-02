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
      high: 'overtime-status-high',
      medium: 'overtime-status-medium',
      low: 'overtime-status-low',
      none: 'overtime-status-none'
    };

    const statusLabels = {
      high: 'High OT',
      medium: 'Medium OT',
      low: 'Low OT',
      none: 'No OT'
    };

    return (
      <span className={`overtime-status-badge ${statusClasses[status]}`}>
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
      <div className="overtime-page-header">
        <h1 className="overtime-page-title">Overtime Pay</h1>
      </div>

      <div className="overtime-container">
        {/* Stats Cards */}
        <div className="overtime-stats-grid">
          <div className="overtime-stat-card stat-blue">
            <div className="overtime-stat-content">
              <div className="overtime-stat-info">
                <Users className="overtime-stat-icon-main" />
                <div className="overtime-stat-details">
                  <p className="overtime-stat-title">Employees with OT</p>
                  <p className="overtime-stat-value">{stats.totalEmployees}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="overtime-stat-card stat-green">
            <div className="overtime-stat-content">
              <div className="overtime-stat-info">
                <Clock className="overtime-stat-icon-main" />
                <div className="overtime-stat-details">
                  <p className="overtime-stat-title">Total Records</p>
                  <p className="overtime-stat-value">{statusFilteredData.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="overtime-stat-card stat-yellow">
            <div className="overtime-stat-content">
              <div className="overtime-stat-info">
                <TrendingUp className="overtime-stat-icon-main" />
                <div className="overtime-stat-details">
                  <p className="overtime-stat-title">Total OT Hours</p>
                  <p className="overtime-stat-value">{stats.totalOvertimeHours}h</p>
                </div>
              </div>
            </div>
          </div>

          <div className="overtime-stat-card stat-red">
            <div className="overtime-stat-content">
              <div className="overtime-stat-info">
                <DollarSign className="overtime-stat-icon-main" />
                <div className="overtime-stat-details">
                  <p className="overtime-stat-title">Total OT Pay</p>
                  <p className="overtime-stat-value">${stats.totalOvertimePay}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="overtime-filters-container">
          <div className="overtime-filters-row">
            <div className="overtime-search-filters">
              {/* Search */}
              <div className="overtime-search-box">
                <Search className="overtime-search-icon" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="overtime-search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Date Range */}
              <select 
                className="overtime-filter-select"
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
                className="overtime-filter-select"
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
                className="overtime-filter-select"
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
            <button onClick={handleExport} className="overtime-export-btn" disabled={loading}>
              <Download className="overtime-btn-icon" />
              Export
            </button>
          </div>
        </div>

        {/* Overtime Table */}
        <div className="overtime-table-container">
          <div className="overtime-table-wrapper">
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
                <thead className="overtime-table-header">
                  <tr>
                    <th className="overtime-table-th">Employee</th>
                    <th className="overtime-table-th">Date</th>
                    <th className="overtime-table-th">Clock In</th>
                    <th className="overtime-table-th">Clock Out</th>
                    <th className="overtime-table-th">Regular Hours</th>
                    <th className="overtime-table-th">OT Hours</th>
                    <th className="overtime-table-th">Regular Pay</th>
                    <th className="overtime-table-th">OT Pay</th>
                    <th className="overtime-table-th">Status</th>
                    <th className="overtime-table-th">Location</th>
                  </tr>
                </thead>
                <tbody className="overtime-table-body">
                  {statusFilteredData.map((record) => (
                    <tr key={record.id} className="overtime-table-row">
                      <td className="overtime-table-td">
                        <div className="overtime-employee-info">
                          <div className="overtime-employee-avatar">
                            <span className="overtime-avatar-text">
                              {record.employeeName?.split(' ').map(n => n[0]).join('') || 'NA'}
                            </span>
                          </div>
                          <div className="overtime-employee-details">
                            <div className="overtime-employee-name">{record.employeeName}</div>
                            <div className="overtime-employee-meta">{record.position} • {record.department}</div>
                          </div>
                        </div>
                      </td>
                      <td className="overtime-table-td">{formatDate(record.date)}</td>
                      <td className="overtime-table-td overtime-table-time">{formatTime(record.checkInTime)}</td>
                      <td className="overtime-table-td overtime-table-time">{formatTime(record.checkOutTime)}</td>
                      <td className="overtime-table-td overtime-table-hours">{record.regularHours}h</td>
                      <td className="overtime-table-td overtime-table-overtime">{record.overtimeHours}h</td>
                      <td className="overtime-table-td overtime-table-pay">${record.regularPay}</td>
                      <td className="overtime-table-td overtime-table-overtime-pay">${record.overtimePay}</td>
                      <td className="overtime-table-td">{getStatusBadge(record.overtimeHours)}</td>
                      <td className="overtime-table-td overtime-table-location">{record.location || 'Office'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {!loading && statusFilteredData.length === 0 && (
            <div className="overtime-empty-state">
              <div className="overtime-empty-title">No overtime records found</div>
              <div className="overtime-empty-subtitle">Try adjusting your search or filter criteria</div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {statusFilteredData.length > 0 && (
          <div className="overtime-pagination-container">
            <div className="overtime-pagination-info">
              Showing <span className="overtime-pagination-highlight">1</span> to{' '}
              <span className="overtime-pagination-highlight">{statusFilteredData.length}</span> of{' '}
              <span className="overtime-pagination-highlight">{pagination.total || statusFilteredData.length}</span> results
            </div>
            <div className="overtime-pagination-controls">
              <button className="overtime-pagination-btn overtime-pagination-btn-disabled" disabled>
                Previous
              </button>
              <button className="overtime-pagination-btn overtime-pagination-btn-active">
                1
              </button>
              <button className="overtime-pagination-btn overtime-pagination-btn-disabled" disabled>
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
