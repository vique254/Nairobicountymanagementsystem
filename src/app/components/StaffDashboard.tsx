import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  FileText,
  LogOut,
  Plus,
  Calendar,
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Users,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { addDailyRecord, getDailyRecordsByStaff, Staff } from '../utils/database';
import { EmployeeManagement } from './EmployeeManagement';
import { Reports } from './Reports';
import countyLogo from 'figma:asset/4d1b08503629329c1d44e2860bd4dd50661b9923.png';

export function StaffDashboard() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'reports'>('overview');
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    location: '',
    activity: '',
    findings: '',
    actionTaken: '',
    status: 'Pending' as 'Pending' | 'Completed' | 'Follow-up Required',
  });

  const staff = currentUser as Staff;
  const myRecords = getDailyRecordsByStaff(staff.id);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addDailyRecord({
      id: '',
      staffId: staff.id,
      staffName: staff.fullName,
      date: formData.date,
      location: formData.location,
      activity: formData.activity,
      findings: formData.findings,
      actionTaken: formData.actionTaken,
      status: formData.status,
      createdAt: '',
    });

    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      location: '',
      activity: '',
      findings: '',
      actionTaken: '',
      status: 'Pending',
    });
    setShowAddRecord(false);
  };

  const todayRecords = myRecords.filter((r) => r.date === new Date().toISOString().split('T')[0]);
  const completedRecords = myRecords.filter((r) => r.status === 'Completed');
  const pendingRecords = myRecords.filter((r) => r.status === 'Follow-up Required');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-width-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <img 
                src={countyLogo} 
                alt="Nairobi City County Logo"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Staff Dashboard</h1>
                <p className="text-sm text-gray-600">Nairobi City County Inspectorate</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{staff.fullName}</p>
                <p className="text-xs text-gray-500">{staff.position}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-width-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              My Records
            </button>
            <button
              onClick={() => setActiveTab('employees')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'employees'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              View Employees
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'reports'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Reports
            </button>
          </div>
        </div>
      </div>

      <main className="max-width-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Records</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{myRecords.length}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today's Records</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{todayRecords.length}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{completedRecords.length}</p>
                  </div>
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Follow-ups</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{pendingRecords.length}</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <User className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{staff.fullName}</h2>
                <p className="text-sm text-gray-600 mt-1">{staff.position}</p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-sm">
                  <div>
                    <span className="text-gray-600">Payroll No:</span>
                    <span className="ml-2 font-medium text-gray-900">{staff.payrollNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2 font-medium text-gray-900">{staff.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <span className="ml-2 font-medium text-gray-900">{staff.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date Joined:</span>
                    <span className="ml-2 font-medium text-gray-900">{staff.dateJoined}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Record Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Daily Records</h2>
          <button
            onClick={() => setShowAddRecord(!showAddRecord)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Record
          </button>
        </div>

        {/* Add Record Form */}
        {showAddRecord && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">New Daily Record</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., CBD - Kenyatta Avenue"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Activity</label>
                <input
                  type="text"
                  value={formData.activity}
                  onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Business License Inspection"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Findings</label>
                <textarea
                  value={formData.findings}
                  onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe what you found during the inspection..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Action Taken</label>
                <textarea
                  value={formData.actionTaken}
                  onChange={(e) => setFormData({ ...formData, actionTaken: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe the action taken..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Follow-up Required">Follow-up Required</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Submit Record
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddRecord(false)}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Records List */}
        <div className="space-y-4">
          {myRecords.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No records yet. Add your first daily record above.</p>
            </div>
          ) : (
            myRecords.map((record) => (
              <div key={record.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{record.activity}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {record.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {record.date}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    record.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    record.status === 'Follow-up Required' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {record.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Findings</p>
                    <p className="text-sm text-gray-900 mt-1">{record.findings}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Action Taken</p>
                    <p className="text-sm text-gray-900 mt-1">{record.actionTaken}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        </div>
        )}

        {activeTab === 'employees' && (
          <EmployeeManagement isAdmin={false} />
        )}

        {activeTab === 'reports' && (
          <Reports />
        )}
      </main>
    </div>
  );
}