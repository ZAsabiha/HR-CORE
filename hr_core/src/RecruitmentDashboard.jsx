
import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, Edit, Trash2, MoreVertical, Users, Briefcase, Calendar, Clock, Star, MapPin, Phone, Mail } from 'lucide-react';

const RecruitmentDashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedJob, setSelectedJob] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

 
  const stats = [
    { id: 1, title: 'Total Candidates', value: '1,247', change: '+12%', icon: Users, color: 'from-blue-500 to-blue-600' },
    { id: 2, title: 'Active Jobs', value: '23', change: '+3', icon: Briefcase, color: 'from-emerald-500 to-emerald-600' },
    { id: 3, title: 'Interviews Today', value: '8', change: '+2', icon: Calendar, color: 'from-purple-500 to-purple-600' },
    { id: 4, title: 'Avg. Time to Hire', value: '12 days', change: '-2 days', icon: Clock, color: 'from-orange-500 to-orange-600' }
  ];

  const jobPostings = [
    { id: 1, title: 'Senior Software Engineer', department: 'Engineering', applicants: 45, status: 'Active', location: 'Remote' },
    { id: 2, title: 'Product Manager', department: 'Product', applicants: 32, status: 'Active', location: 'New York' },
    { id: 3, title: 'UX Designer', department: 'Design', applicants: 28, status: 'Active', location: 'San Francisco' },
    { id: 4, title: 'Data Scientist', department: 'Analytics', applicants: 19, status: 'Draft', location: 'Remote' },
    { id: 5, title: 'DevOps Engineer', department: 'Engineering', applicants: 15, status: 'Active', location: 'Austin' }
  ];

  const candidates = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 123-4567',
      position: 'Senior Software Engineer',
      experience: '5+ years',
      status: 'New',
      rating: 4.5,
      location: 'San Francisco, CA',
      appliedDate: '2024-07-10',
      avatar: 'SJ',
      skills: ['React', 'Node.js', 'Python']
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      email: 'm.rodriguez@email.com',
      phone: '+1 (555) 987-6543',
      position: 'Product Manager',
      experience: '3+ years',
      status: 'Screening',
      rating: 4.2,
      location: 'New York, NY',
      appliedDate: '2024-07-09',
      avatar: 'MR',
      skills: ['Product Strategy', 'Analytics', 'Leadership']
    },
    {
      id: 3,
      name: 'Emma Liu',
      email: 'e.liu@email.com',
      phone: '+1 (555) 456-7890',
      position: 'UX Designer',
      experience: '4+ years',
      status: 'Interview',
      rating: 4.8,
      location: 'Austin, TX',
      appliedDate: '2024-07-08',
      avatar: 'EL',
      skills: ['Figma', 'User Research', 'Prototyping']
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'd.kim@email.com',
      phone: '+1 (555) 321-0987',
      position: 'Data Scientist',
      experience: '6+ years',
      status: 'Offer',
      rating: 4.6,
      location: 'Seattle, WA',
      appliedDate: '2024-07-07',
      avatar: 'DK',
      skills: ['Python', 'Machine Learning', 'SQL']
    },
    {
      id: 5,
      name: 'Alex Thompson',
      email: 'a.thompson@email.com',
      phone: '+1 (555) 654-3210',
      position: 'DevOps Engineer',
      experience: '4+ years',
      status: 'New',
      rating: 4.3,
      location: 'Denver, CO',
      appliedDate: '2024-07-06',
      avatar: 'AT',
      skills: ['AWS', 'Docker', 'Kubernetes']
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'New': 'bg-blue-50 text-blue-700 border-blue-200',
      'Screening': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'Interview': 'bg-purple-50 text-purple-700 border-purple-200',
      'Offer': 'bg-green-50 text-green-700 border-green-200'
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || candidate.status.toLowerCase() === activeTab;
    const matchesJob = selectedJob === 'all' || candidate.position === selectedJob;
    
    return matchesSearch && matchesTab && matchesJob;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 px-8 py-6 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Recruitment Dashboard
            </h1>
            <p className="text-slate-600 mt-1">Manage your hiring pipeline and track candidate progress</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-6 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-all duration-200 hover:shadow-md">
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {/* Compact Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.id} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full mt-2 inline-block">
                      {stat.change}
                    </span>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - Candidates */}
          <div className="lg:col-span-3 space-y-6">
            {/* Enhanced Search and Filters */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search candidates by name or position..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
                  />
                </div>
                <div className="flex gap-3">
                  <select
                    value={selectedJob}
                    onChange={(e) => setSelectedJob(e.target.value)}
                    className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  >
                    <option value="all">All Positions</option>
                    {jobPostings.map(job => (
                      <option key={job.id} value={job.title}>{job.title}</option>
                    ))}
                  </select>
                  <button className="flex items-center px-4 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-all duration-200">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </button>
                </div>
              </div>

              {/* Enhanced Tab Navigation */}
              <div className="flex space-x-2 bg-slate-100 p-1.5 rounded-xl">
                {['all', 'new', 'screening', 'interview', 'offer'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeTab === tab
                        ? 'bg-white text-blue-600 shadow-md'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {tab !== 'all' && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
                        {candidates.filter(c => c.status.toLowerCase() === tab).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Candidates List */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">
                  Candidates ({filteredCandidates.length})
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {filteredCandidates.map((candidate) => (
                  <div key={candidate.id} className="p-8 hover:bg-blue-50/50 transition-all duration-200 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {candidate.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-semibold text-slate-900">{candidate.name}</h3>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium text-slate-700">{candidate.rating}</span>
                            </div>
                          </div>
                          <p className="text-lg text-blue-600 font-medium mb-3">{candidate.position}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-slate-400" />
                              <span>{candidate.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4 text-slate-400" />
                              <span>{candidate.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-slate-400" />
                              <span>{candidate.location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              <span>Applied {candidate.appliedDate}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {candidate.skills.map((skill, index) => (
                              <span key={index} className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-4 py-2 text-sm font-medium rounded-xl border ${getStatusColor(candidate.status)}`}>
                          {candidate.status}
                        </span>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Job Postings */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Active Jobs</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
              </div>
              <div className="space-y-4">
                {jobPostings.slice(0, 4).map((job) => (
                  <div key={job.id} className="p-4 bg-gradient-to-r from-white to-blue-50 border border-slate-200 rounded-xl hover:shadow-md transition-all duration-200 group cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors duration-200">
                          {job.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1">{job.department}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-500">{job.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900">{job.applicants}</p>
                        <p className="text-xs text-slate-600">applicants</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm text-slate-900 font-medium">Sarah Johnson moved to Interview</p>
                    <p className="text-xs text-slate-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm text-slate-900 font-medium">New application for UX Designer</p>
                    <p className="text-xs text-slate-500">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm text-slate-900 font-medium">Interview scheduled with Michael</p>
                    <p className="text-xs text-slate-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm text-slate-900 font-medium">Offer sent to David Kim</p>
                    <p className="text-xs text-slate-500">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentDashboard;
