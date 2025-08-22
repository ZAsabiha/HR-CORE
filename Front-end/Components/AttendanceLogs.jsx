import React, { useState, useMemo, useEffect } from 'react';
import { Search, Download, Calendar, Filter, Clock, Users, TrendingUp, Eye } from 'lucide-react';
import AttendanceTracker from './AttendanceTracker';
import './AttendanceLogs.css';

const AttendanceLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateRange, setDateRange] = useState('today');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  
  // Backend data states
  const [attendanceData, setAttendanceData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState(['all']);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, late: 0 });

  // Fetch employees for dropdown
  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/employees', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
        
        // Extract unique departments
        const depts = ['all', ...new Set(data.map(emp => emp.department?.name).filter(Boolean))];
        setDepartments(depts);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // Fetch attendance logs
  const fetchAttendanceLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (selectedDepartment !== 'all') params.append('department', selectedDepartment);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      
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
      }

      const response = await fetch(`http://localhost:5000/api/attendance/logs?${params}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setAttendanceData(data.logs || []);
        setStats(data.stats || { total: 0, present: 0, absent: 0, late: 0 });
        setPagination(data.pagination || {});
      }
    } catch (error) {
      console.error('Error fetching attendance logs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchAttendanceLogs();
  }, [selectedDepartment, selectedStatus, dateRange]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return attendanceData;
    
    return attendanceData.filter(record => {
      const employeeName = record.employee?.name?.toLowerCase() || '';
      const employeeEmail = record.employee?.email?.toLowerCase() || '';
      const search = searchTerm.toLowerCase();
      return employeeName.includes(search) || employeeEmail.includes(search);
    });
  }, [attendanceData, searchTerm]);

  const getStatusBadge = (status) => {
    const statusClasses = {
      PRESENT: 'status-present',
      LATE: 'status-late',
      ABSENT: 'status-absent',
      EARLY_DEPARTURE: 'status-early',
      OVERTIME: 'status-overtime',
      HALF_DAY: 'status-early',
      ON_BREAK: 'status-late'
    };
    
    const statusLabels = {
      PRESENT: 'Present',
      LATE: 'Late',
      ABSENT: 'Absent',
      EARLY_DEPARTURE: 'Early Out',
      OVERTIME: 'Overtime',
      HALF_DAY: 'Half Day',
      ON_BREAK: 'On Break'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || statusClasses.PRESENT}`}>
        {statusLabels[status] || 'Present'}
      </span>
    );
  };

  const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatHours = (hours) => {
    if (!hours) return '--';
    return `${hours.toFixed(1)}h`;
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ['Date', 'Employee', 'Check In', 'Check Out', 'Total Hours', 'Break (mins)', 'Status', 'Location'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(record => [
        new Date(record.date).toLocaleDateString(),
        record.employee?.name || '',
        formatTime(record.checkInTime),
        formatTime(record.checkOutTime),
        formatHours(record.totalHours),
        record.breakMinutes || 0,
        record.status,
        record.location || 'Office'
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleAttendanceUpdate = () => {
    // Refresh logs when attendance is updated
    fetchAttendanceLogs();
  };

  return (
    <div className="attendance-layout">
      <div className="attendance-main-content">
        <div className="attendance-container">
          
          {/* Attendance Tracker Section */}
          <div className="tracker-section" style={{ marginBottom: '24px' }}>
            <div className="employee-selector" style={{ marginBottom: '16px' }}>
              <label htmlFor="employee-select" style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600',
                color: '#0C3D4A'
              }}>
                Select Employee for Attendance Tracking:
              </label>
              <select
                id="employee-select"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="filter-select"
                style={{ minWidth: '300px' }}
              >
                <option value="">-- Select Employee --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.email})
                  </option>
                ))}
              </select>
            </div>

            <AttendanceTracker 
              employeeId={selectedEmployee}
              onAttendanceUpdate={handleAttendanceUpdate}
            />
          </div>

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
                  <option value="PRESENT">Present</option>
                  <option value="LATE">Late</option>
                  <option value="ABSENT">Absent</option>
                  <option value="HALF_DAY">Half Day</option>
                  <option value="EARLY_DEPARTURE">Early Out</option>
                  <option value="OVERTIME">Overtime</option>
                </select>
              </div>
              <button onClick={handleExport} className="export-btn" disabled={loading}>
                <Download className="btn-icon" />
                Export
              </button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="attendance-table-container">
            <div className="table-wrapper">
              {loading ? (
                <div style={{ 
                  padding: '40px', 
                  textAlign: 'center', 
                  color: '#666' 
                }}>
                  Loading attendance data...
                </div>
              ) : (
                <table className="attendance-table">
                  <thead className="table-header">
                    <tr>
                      <th className="table-th">Employee</th>
                      <th className="table-th">Date</th>
                      <th className="table-th">Clock In</th>
                      <th className="table-th">Clock Out</th>
                      <th className="table-th">Total Hours</th>
                      <th className="table-th">Break</th>
                      <th className="table-th">Status</th>
                      <th className="table-th">Location</th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {filteredData.map(record => (
                      <tr key={record.id} className="table-row">
                        <td className="table-td">
                          <div className="employee-info">
                            <div className="employee-avatar">
                              <span className="avatar-text">
                                {record.employee?.name?.split(' ').map(n => n[0]).join('') || 'NA'}
                              </span>
                            </div>
                            <div className="employee-details">
                              <div className="employee-name">{record.employee?.name || 'Unknown'}</div>
                              <div className="employee-meta">
                                {record.employee?.email} • {record.employee?.department?.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="table-td">{new Date(record.date).toLocaleDateString()}</td>
                        <td className="table-td table-time">{formatTime(record.checkInTime)}</td>
                        <td className="table-td table-time">{formatTime(record.checkOutTime)}</td>
                        <td className="table-td table-hours">{formatHours(record.totalHours)}</td>
                        <td className="table-td table-break">{record.breakMinutes || 0}m</td>
                        <td className="table-td">{getStatusBadge(record.status)}</td>
                        <td className="table-td table-location">{record.location || 'Office'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {!loading && filteredData.length === 0 && (
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
                Showing <span className="pagination-highlight">1</span> to{' '}
                <span className="pagination-highlight">{filteredData.length}</span> of{' '}
                <span className="pagination-highlight">{pagination.total || filteredData.length}</span> results
              </div>
              <div className="pagination-controls">
                <button className="pagination-btn pagination-btn-disabled" disabled>
                  Previous
                </button>
                <button className="pagination-btn pagination-btn-active">1</button>
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
