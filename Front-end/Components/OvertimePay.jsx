import React, { useState, useMemo } from 'react';
import { Search, Download, Clock, Users, TrendingUp, DollarSign, MapPin } from 'lucide-react';
import './OvertimePay.css';

const OvertimePay = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateRange, setDateRange] = useState('today');

  const overtimeData = [
    {
      id: 1,
      employeeId: 'EMP001',
      name: 'Zannatul Adon Sabiha',
      department: 'Engineering',
      avatar: 'ZS',
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
      name: 'Israt Risha Ivey',
      department: 'Marketing',
      avatar: 'IR',
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
      name: 'Sanjana Afreen',
      department: 'HR',
      avatar: 'SA',
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
      name: 'Ridika Naznin',
      department: 'Engineering',
      avatar: 'RN',
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
      name: 'Ayesha Binte Anis',
      department: 'Finance',
      avatar: 'AB',
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
      name: 'Afridah Zarin Khan',
      department: 'Sales',
      avatar: 'AZ',
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
  }, [searchTerm, selectedDepartment, selectedStatus]);

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

  const getStatusBadge = (overtimeHours) => {
    if (overtimeHours > 3) {
      return <span className="status-badge status-high">High OT</span>;
    } else if (overtimeHours > 1) {
      return <span className="status-badge status-medium">Medium OT</span>;
    } else if (overtimeHours > 0) {
      return <span className="status-badge status-low">Low OT</span>;
    }
    return <span className="status-badge status-none">No OT</span>;
  };

  const handleExport = () => {
    console.log('Exporting overtime data...');
  };

  return (
    <div className="overtime-container">
      <div className="overtime-wrapper">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Overtime Pay</h1>
          <p className="page-subtitle">Manage and track employee overtime hours and compensation</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Total Employees</p>
                <p className="stat-value">{stats.totalEmployees}</p>
              </div>
              <div className="stat-icon stat-icon-blue">
                <Users size={24} />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Eligible for OT</p>
                <p className="stat-value">{stats.eligibleForOvertime}</p>
              </div>
              <div className="stat-icon stat-icon-green">
                <Clock size={24} />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Total OT Hours</p>
                <p className="stat-value">{stats.totalOvertimeHours}h</p>
              </div>
              <div className="stat-icon stat-icon-orange">
                <TrendingUp size={24} />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Total OT Pay</p>
                <p className="stat-value">${stats.totalOvertimePay}</p>
              </div>
              <div className="stat-icon stat-icon-purple">
                <DollarSign size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-container">
          <div className="filters-wrapper">
            <div className="filters-left">
              {/* Search */}
              <div className="search-container">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter Selects */}
              <div className="filter-selects">
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
            </div>

            {/* Export Button */}
            <button onClick={handleExport} className="export-btn">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
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
                    <td className="table-td">
                      <span className={`overtime-hours ${record.overtimeHours > 0 ? 'has-overtime' : 'no-overtime'}`}>
                        {record.overtimeHours}h
                      </span>
                    </td>
                    <td className="table-td table-pay">${calculateRegularPay(record.regularHours, record.hourlyRate)}</td>
                    <td className="table-td">
                      <span className={`overtime-pay ${record.overtimeHours > 0 ? 'has-overtime' : 'no-overtime'}`}>
                        ${calculateOvertimePay(record.overtimeHours, record.hourlyRate)}
                      </span>
                    </td>
                    <td className="table-td">{getStatusBadge(record.overtimeHours)}</td>
                    <td className="table-td">
                      <div className="location-info">
                        <MapPin size={16} />
                        <span>{record.location}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <Search size={48} />
              </div>
              <h3 className="empty-title">No overtime records found</h3>
              <p className="empty-description">Try adjusting your search or filter criteria</p>
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
  );
};

export default OvertimePay;
