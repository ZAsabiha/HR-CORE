import React, { useState, useMemo } from 'react';
import { Search, Download, Calendar, Filter, Clock, Users, TrendingUp, DollarSign, Menu, ChevronDown } from 'lucide-react';
import Sidebar from './Sidebar';
import './OvertimePay.css';

const OvertimePay = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateRange, setDateRange] = useState('today');
  const [topSearchTerm, setTopSearchTerm] = useState('');

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const overtimeData = [
    {
      id: 1,
      employeeId: 'EMP001',
      name: 'Sarah Johnson',
      department: 'Engineering',
      avatar: 'SJ',
      clockIn: '09:00 AM',
      clockOut: '07:30 PM',
      regularHours: 8,
      overtimeHours: 2.5,
      hourlyRate: 25,
      totalHours: '10h 30m',
      break: '45m',
      location: 'Office',
      date: '2025-07-12'
    },
    {
      id: 2,
      employeeId: 'EMP002',
      name: 'Michael Chen',
      department: 'Marketing',
      avatar: 'MC',
      clockIn: '09:15 AM',
      clockOut: '08:45 PM',
      regularHours: 8,
      overtimeHours: 3.5,
      hourlyRate: 22,
      totalHours: '11h 30m',
      break: '60m',
      location: 'Remote',
      date: '2025-07-12'
    },
    {
      id: 3,
      employeeId: 'EMP003',
      name: 'Emily Rodriguez',
      department: 'HR',
      avatar: 'ER',
      clockIn: '08:45 AM',
      clockOut: '06:30 PM',
      regularHours: 8,
      overtimeHours: 1.75,
      hourlyRate: 28,
      totalHours: '9h 45m',
      break: '30m',
      location: 'Office',
      date: '2025-07-12'
    },
    {
      id: 4,
      employeeId: 'EMP004',
      name: 'David Kim',
      department: 'Engineering',
      avatar: 'DK',
      clockIn: '08:30 AM',
      clockOut: '09:15 PM',
      regularHours: 8,
      overtimeHours: 4.75,
      hourlyRate: 30,
      totalHours: '12h 45m',
      break: '60m',
      location: 'Office',
      date: '2025-07-12'
    },
    {
      id: 5,
      employeeId: 'EMP005',
      name: 'Lisa Wang',
      department: 'Finance',
      avatar: 'LW',
      clockIn: '09:05 AM',
      clockOut: '07:00 PM',
      regularHours: 8,
      overtimeHours: 1.92,
      hourlyRate: 26,
      totalHours: '9h 55m',
      break: '45m',
      location: 'Office',
      date: '2025-07-12'
    },
    {
      id: 6,
      employeeId: 'EMP006',
      name: 'James Wilson',
      department: 'Sales',
      avatar: 'JW',
      clockIn: '08:30 AM',
      clockOut: '08:15 PM',
      regularHours: 8,
      overtimeHours: 3.75,
      hourlyRate: 24,
      totalHours: '11h 45m',
      break: '60m',
      location: 'Office',
      date: '2025-07-12'
    }
  ];

  const departments = ['all', 'Engineering', 'Marketing', 'HR', 'Finance', 'Sales'];
  const statuses = ['all', 'eligible', 'not_eligible'];

  const filteredData = useMemo(() => {
    return overtimeData.filter(record => {
      const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || record.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'all' || 
                          (selectedStatus === 'eligible' && record.overtimeHours > 0) ||
                          (selectedStatus === 'not_eligible' && record.overtimeHours === 0);
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [searchTerm, selectedDepartment, selectedStatus, overtimeData]);

  const stats = useMemo(() => {
    const totalEmployees = filteredData.length;
    const eligibleForOvertime = filteredData.filter(r => r.overtimeHours > 0).length;
    const totalOvertimeHours = filteredData.reduce((sum, record) => sum + record.overtimeHours, 0);
    const totalOvertimePay = filteredData.reduce((sum, record) => {
      return sum + (record.overtimeHours * record.hourlyRate * 1.5);
    }, 0);
    
    return { 
      totalEmployees, 
      eligibleForOvertime, 
      totalOvertimeHours: totalOvertimeHours.toFixed(1), 
      totalOvertimePay: totalOvertimePay.toFixed(2) 
    };
  }, [filteredData]);

  const calculateOvertimePay = (overtimeHours, hourlyRate) => {
    return (overtimeHours * hourlyRate * 1.5).toFixed(2);
  };

  const calculateRegularPay = (regularHours, hourlyRate) => {
    return (regularHours * hourlyRate).toFixed(2);
  };

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

  const handleExport = () => {
    console.log('Exporting overtime data...');
  };

  return (
    <div className="overtime-layout">
      <Sidebar onLogout={handleLogout} />
      <div className="overtime-main-content">
        {/* Top Navigation Header */}
        <div className="top-navigation">
          <div className="nav-left">
            <Menu className="menu-icon" />
            <div className="employee-dropdown">
              <Users className="dropdown-icon" />
              <span className="dropdown-text">All Employees</span>
              <ChevronDown className="dropdown-arrow" />
            </div>
            <div className="top-search-box">
              <Search className="top-search-icon" />
              <input
                type="text"
                placeholder="Search..."
                className="top-search-input"
                value={topSearchTerm}
                onChange={(e) => setTopSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="nav-right">
            <a href="#" className="nav-link">Home</a>
            <a href="#" className="nav-link">About</a>
            <a href="#" className="nav-link">Contacts</a>
            <a href="#" className="nav-link">Login</a>
          </div>
        </div>

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
                    <p className="stat-title">Total Employees</p>
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
                    <p className="stat-title">Eligible for OT</p>
                    <p className="stat-value">{stats.eligibleForOvertime}</p>
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
                  <option value="eligible">Eligible for OT</option>
                  <option value="not_eligible">Not Eligible</option>
                </select>
              </div>

              {/* Export Button */}
              <button onClick={handleExport} className="export-btn">
                <Download className="btn-icon" />
                Export
              </button>
            </div>
          </div>

          {/* Overtime Table */}
          <div className="overtime-table-container">
            <div className="table-wrapper">
              <table className="overtime-table">
                <thead className="table-header">
                  <tr>
                    <th className="table-th">Employee</th>
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
                  {filteredData.map((record) => (
                    <tr key={record.id} className="table-row">
                      <td className="table-td">
                        <div className="employee-info">
                          <div className="employee-avatar">
                            <span className="avatar-text">{record.avatar}</span>
                          </div>
                          <div className="employee-details">
                            <div className="employee-name">{record.name}</div>
                            <div className="employee-meta">{record.employeeId} • {record.department}</div>
                          </div>
                        </div>
                      </td>
                      <td className="table-td table-time">{record.clockIn}</td>
                      <td className="table-td table-time">{record.clockOut}</td>
                      <td className="table-td table-hours">{record.regularHours}h</td>
                      <td className="table-td table-overtime">{record.overtimeHours}h</td>
                      <td className="table-td table-pay">${calculateRegularPay(record.regularHours, record.hourlyRate)}</td>
                      <td className="table-td table-overtime-pay">${calculateOvertimePay(record.overtimeHours, record.hourlyRate)}</td>
                      <td className="table-td">{getStatusBadge(record.overtimeHours)}</td>
                      <td className="table-td table-location">{record.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredData.length === 0 && (
              <div className="empty-state">
                <div className="empty-title">No overtime records found</div>
                <div className="empty-subtitle">Try adjusting your search or filter criteria</div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredData.length > 0 && (
            <div className="pagination-container">
              <div className="pagination-info">
                Showing <span className="pagination-highlight">1</span> to <span className="pagination-highlight">{filteredData.length}</span> of{' '}
                <span className="pagination-highlight">{filteredData.length}</span> results
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
    </div>
  );
};

export default OvertimePay;