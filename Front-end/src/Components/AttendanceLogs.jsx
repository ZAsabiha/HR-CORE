import React, { useState, useMemo } from 'react';
import { Search, Download, Calendar, Filter, Clock, Users, TrendingUp, Eye } from 'lucide-react';
import Sidebar from './Sidebar';
import './AttendanceLogs.css';

const AttendanceLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateRange, setDateRange] = useState('today');


  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const attendanceData = [
    {
      id: 1,
      employeeId: 'EMP001',
      name: 'Sarah Johnson',
      department: 'Engineering',
      avatar: 'SJ',
      clockIn: '09:00 AM',
      clockOut: '05:30 PM',
      status: 'present',
      totalHours: '8h 30m',
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
      clockOut: '05:45 PM',
      status: 'late',
      totalHours: '8h 30m',
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
      clockOut: '05:00 PM',
      status: 'present',
      totalHours: '8h 15m',
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
      clockIn: '--',
      clockOut: '--',
      status: 'absent',
      totalHours: '0h',
      break: '--',
      location: '--',
      date: '2025-07-12'
    },
    {
      id: 5,
      employeeId: 'EMP005',
      name: 'Lisa Wang',
      department: 'Finance',
      avatar: 'LW',
      clockIn: '09:05 AM',
      clockOut: '04:30 PM',
      status: 'early_departure',
      totalHours: '7h 25m',
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
      clockOut: '06:15 PM',
      status: 'overtime',
      totalHours: '9h 45m',
      break: '60m',
      location: 'Office',
      date: '2025-07-12'
    }
  ];

  const departments = ['all', 'Engineering', 'Marketing', 'HR', 'Finance', 'Sales'];
  const statuses = ['all', 'present', 'late', 'absent', 'early_departure', 'overtime'];

  
  const filteredData = useMemo(() => {
    return attendanceData.filter(record => {
      const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || record.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [searchTerm, selectedDepartment, selectedStatus, attendanceData]);


  const stats = useMemo(() => {
    const total = filteredData.length;
    const present = filteredData.filter(r => r.status === 'present' || r.status === 'late' || r.status === 'overtime' || r.status === 'early_departure').length;
    const absent = filteredData.filter(r => r.status === 'absent').length;
    const late = filteredData.filter(r => r.status === 'late').length;
    
    return { total, present, absent, late };
  }, [filteredData]);

  const getStatusBadge = (status) => {
    const statusClasses = {
      present: 'status-present',
      late: 'status-late',
      absent: 'status-absent',
      early_departure: 'status-early',
      overtime: 'status-overtime'
    };

    const statusLabels = {
      present: 'Present',
      late: 'Late',
      absent: 'Absent',
      early_departure: 'Early Out',
      overtime: 'Overtime'
    };

    return (
      <span className={`status-badge ${statusClasses[status] || statusClasses.present}`}>
        {statusLabels[status] || 'Present'}
      </span>
    );
  };

  const handleExport = () => {
    console.log('Exporting attendance data...');
  };

  return (
    <div className="attendance-layout">
      <Sidebar onLogout={handleLogout} />
      <div className="attendance-main-content">
        <div className="attendance-container">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card stat-blue">
              <div className="stat-content">
                <div className="stat-info">
                  <Users className="stat-icon-main" />
                  <div className="stat-details">
                    <p className="stat-title">Total Employees</p>
                    <p className="stat-value">{stats.total}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="stat-card stat-green">
              <div className="stat-content">
                <div className="stat-info">
                  <Clock className="stat-icon-main" />
                  <div className="stat-details">
                    <p className="stat-title">Present</p>
                    <p className="stat-value">{stats.present}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="stat-card stat-yellow">
              <div className="stat-content">
                <div className="stat-info">
                  <TrendingUp className="stat-icon-main" />
                  <div className="stat-details">
                    <p className="stat-title">Late Arrivals</p>
                    <p className="stat-value">{stats.late}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="stat-card stat-red">
              <div className="stat-content">
                <div className="stat-info">
                  <Eye className="stat-icon-main" />
                  <div className="stat-details">
                    <p className="stat-title">Absent</p>
                    <p className="stat-value">{stats.absent}</p>
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
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'All Status' : status.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Export Button */}
              <button onClick={handleExport} className="export-btn">
                <Download className="btn-icon" />
                Export
              </button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="attendance-table-container">
            <div className="table-wrapper">
              <table className="attendance-table">
                <thead className="table-header">
                  <tr>
                    <th className="table-th">Employee</th>
                    <th className="table-th">Clock In</th>
                    <th className="table-th">Clock Out</th>
                    <th className="table-th">Total Hours</th>
                    <th className="table-th">Break</th>
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
                      <td className="table-td table-hours">{record.totalHours}</td>
                      <td className="table-td table-break">{record.break}</td>
                      <td className="table-td">{getStatusBadge(record.status)}</td>
                      <td className="table-td table-location">{record.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredData.length === 0 && (
              <div className="empty-state">
                <div className="empty-title">No attendance records found</div>
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

export default AttendanceLogs;