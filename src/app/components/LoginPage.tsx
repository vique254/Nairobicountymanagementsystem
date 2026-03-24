import image_4d1b08503629329c1d44e2860bd4dd50661b9923 from 'figma:asset/4d1b08503629329c1d44e2860bd4dd50661b9923.png'
import inspectorateImage1 from 'figma:asset/93deefbfd2e0928c2a92a57bad5cfcffe97f62e4.png';
import inspectorateImage2 from 'figma:asset/4e038f01d0ac6a498452e0c644d872a823b5776c.png';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Shield, User, Lock } from 'lucide-react';
import { loginStaff, loginAdmin, initializeDatabase } from '../utils/database';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const [loginType, setLoginType] = useState<'staff' | 'admin'>('staff');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // Initialize database on component mount
  useState(() => {
    initializeDatabase();
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (loginType === 'admin') {
      const admin = loginAdmin(credentials.username, credentials.password);
      if (admin) {
        login(admin, 'admin');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid admin credentials');
      }
    } else {
      const staff = loginStaff(credentials.username, credentials.password);
      if (staff) {
        login(staff, 'staff');
        navigate('/staff/dashboard');
      } else {
        setError('Invalid payroll number or password');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Images and Branding */}
          <div className="hidden lg:block">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <img 
                  src={image_4d1b08503629329c1d44e2860bd4dd50661b9923} 
                  alt="Nairobi City County Logo"
                  className="w-32 h-32 object-contain"
                />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Nairobi City County
              </h1>
              <p className="text-xl text-gray-600">Inspectorate Department</p>
              <p className="text-sm text-gray-500 mt-1">Management System</p>
            </div>

            {/* Images Grid */}
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src={inspectorateImage1} 
                  alt="Nairobi City County Inspectorate Officers"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src={inspectorateImage2} 
                  alt="Inspectorate Leadership"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full">
            {/* Header for mobile */}
            <div className="text-center mb-8 lg:hidden">
              <div className="flex justify-center mb-4">
                <img 
                  src={image_4d1b08503629329c1d44e2860bd4dd50661b9923} 
                  alt="Nairobi City County Logo"
                  className="w-24 h-24 object-contain"
                />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Nairobi City County
              </h1>
              <p className="text-lg text-gray-600">Inspectorate Department</p>
              <p className="text-sm text-gray-500 mt-1">Management System</p>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-lg shadow-xl p-8">
              {/* Login Type Selector */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setLoginType('staff')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                    loginType === 'staff'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Staff Login
                </button>
                <button
                  onClick={() => setLoginType('admin')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                    loginType === 'admin'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Shield className="w-4 h-4 inline mr-2" />
                  Admin Login
                </button>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {loginType === 'admin' ? 'Username' : 'Payroll Number'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={credentials.username}
                      onChange={(e) =>
                        setCredentials({ ...credentials, username: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={loginType === 'admin' ? 'Enter username' : 'e.g., NCC2024001'}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={credentials.password}
                      onChange={(e) =>
                        setCredentials({ ...credentials, password: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter password"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                    loginType === 'admin'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  Sign In
                </button>
              </form>

              {/* Register Link */}
              {loginType === 'staff' && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    New staff member?{' '}
                    <button
                      onClick={() => navigate('/register')}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      Register here
                    </button>
                  </p>
                </div>
              )}

              {/* Demo Credentials */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center mb-2">Demo Credentials:</p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Admin:</strong> username: admin | password: admin123</p>
                  <p><strong>Staff:</strong> payroll: NCC2024001 | password: password123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}