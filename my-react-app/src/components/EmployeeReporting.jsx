import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, UserCheck, UserX, TrendingUp, Calendar, DollarSign, Search, Filter, Download } from 'lucide-react';

const EmployeeReporting = () => {

  const [employees, setEmployees] = useState([]);

  React.useEffect(() => {
    fetch('/api/employees')
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(() => setEmployees([]));
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Calculate statistics
  const stats = useMemo(() => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
    const inactiveEmployees = totalEmployees - activeEmployees;
    const avgSalary = Math.round(employees.reduce((sum, emp) => sum + emp.salary, 0) / totalEmployees);
    const departments = [...new Set(employees.map(emp => emp.department))];
    
    return {
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      avgSalary,
      departments: departments.length
    };
  }, [employees]);

  // Department distribution data
  const departmentData = useMemo(() => {
    const deptCount = employees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(deptCount).map(([name, value]) => ({ name, value }));
  }, [employees]);


  const salaryRangeData = useMemo(() => {
    const ranges = {
      '40k-50k': 0,
      '50k-60k': 0,
      '60k-70k': 0,
      '70k-80k': 0,
      '80k+': 0
    };
    
    employees.forEach(emp => {
      if (emp.salary < 50000) ranges['40k-50k']++;
      else if (emp.salary < 60000) ranges['50k-60k']++;
      else if (emp.salary < 70000) ranges['60k-70k']++;
      else if (emp.salary < 80000) ranges['70k-80k']++;
      else ranges['80k+']++;
    });
    
    return Object.entries(ranges).map(([range, count]) => ({ range, count }));
  }, [employees]);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           emp.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = departmentFilter === 'All' || emp.department === departmentFilter;
      const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [employees, searchTerm, departmentFilter, statusFilter]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-l-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Reporting Dashboard</h1>
          <p className="text-gray-600">Comprehensive employee analytics and insights</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard 
            icon={Users} 
            title="Total Employees" 
            value={stats.totalEmployees} 
            color="text-blue-500" 
          />
          <StatCard 
            icon={UserCheck} 
            title="Active Employees" 
            value={stats.activeEmployees} 
            color="text-green-500" 
          />
          <StatCard 
            icon={UserX} 
            title="Inactive Employees" 
            value={stats.inactiveEmployees} 
            color="text-red-500" 
          />
          <StatCard 
            icon={DollarSign} 
            title="Average Salary" 
            value={`$${stats.avgSalary.toLocaleString()}`} 
            color="text-purple-500" 
          />
          <StatCard 
            icon={TrendingUp} 
            title="Departments" 
            value={stats.departments} 
            color="text-yellow-500" 
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Department Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Salary Range Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Range Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salaryRangeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-900">Employee Details</h3>
              
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="All">All Departments</option>
                  {[...new Set(employees.map(emp => emp.department))].map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">Age: {employee.age}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${employee.salary.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        employee.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.joinDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.experience} years</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {filteredEmployees.length} of {employees.length} employees
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                  1
                </button>
                <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeReporting;