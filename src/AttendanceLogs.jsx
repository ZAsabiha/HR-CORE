
import React, { useState, useMemo } from 'react';
import { Search, Download, Calendar, Filter, Clock, Users, TrendingUp, Eye } from 'lucide-react';

const AttendanceLogsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateRange, setDateRange] = useState('today');

  // Sample attendance data
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

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return attendanceData.filter(record => {
      const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || record.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [searchTerm, selectedDepartment, selectedStatus, attendanceData]);

  // Calculate summary stats
  const stats = useMemo(() => {
    const total = filteredData.length;
    const present = filteredData.filter(r => r.status === 'present' || r.status === 'late' || r.status === 'overtime' || r.status === 'early_departure').length;
    const absent = filteredData.filter(r => r.status === 'absent').length;
    const late = filteredData.filter(r => r.status === 'late').length;
    
    return { total, present, absent, late };
  }, [filteredData]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      present: { bg: 'bg-green-100', text: 'text-green-800', label: 'Present' },
      late: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Late' },
      absent: { bg: 'bg-red-100', text: 'text-red-800', label: 'Absent' },
      early_departure: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Early Out' },
      overtime: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Overtime' }
    };

    const config = statusConfig[status] || statusConfig.present;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8" style={{ color: '#0C3D4A' }} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Present</p>
                <p className="text-2xl font-bold text-gray-900">{stats.present}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Late Arrivals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.late}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Absent</p>
                <p className="text-2xl font-bold text-gray-900">{stats.absent}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
                  style={{ 
                    '--tw-ring-color': '#0C3D4A',
                    focusRingColor: '#0C3D4A'
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Date Range */}
              <select 
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
                style={{ 
                  '--tw-ring-color': '#0C3D4A',
                  focusRingColor: '#0C3D4A'
                }}
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
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
                style={{ 
                  '--tw-ring-color': '#0C3D4A',
                  focusRingColor: '#0C3D4A'
                }}
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
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
                style={{ 
                  '--tw-ring-color': '#0C3D4A',
                  focusRingColor: '#0C3D4A'
                }}
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
            <button 
              className="flex items-center gap-2 px-4 py-2 text-white rounded-md hover:opacity-90 transition-colors"
              style={{ backgroundColor: '#0C3D4A' }}
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clock In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clock Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Break
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div 
                            className="h-10 w-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: '#E8F4F1' }}
                          >
                            <span 
                              className="text-sm font-medium"
                              style={{ color: '#0C3D4A' }}
                            >
                              {record.avatar}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{record.name}</div>
                          <div className="text-sm text-gray-500">{record.employeeId} • {record.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.clockIn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.clockOut}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.totalHours}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.break}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.location}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">No attendance records found</div>
              <div className="text-gray-400">Try adjusting your search or filter criteria</div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredData.length}</span> of{' '}
              <span className="font-medium">{filteredData.length}</span> results
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>
                Previous
              </button>
              <button 
                className="px-3 py-2 text-sm text-white rounded-md hover:opacity-90"
                style={{ backgroundColor: '#0C3D4A' }}
              >
                1
              </button>
              <button className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceLogsPage;