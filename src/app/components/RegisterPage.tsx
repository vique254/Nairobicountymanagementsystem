import { useState } from 'react';
import { useNavigate } from 'react-router';
import { UserPlus, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { registerStaff, verifyPayrollNumber, isPayrollUsed } from '../utils/database';
import { Staff } from '../utils/database';
import countyLogo from 'figma:asset/4d1b08503629329c1d44e2860bd4dd50661b9923.png';

export function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    payrollNumber: '',
    fullName: '',
    email: '',
    phone: '',
    department: 'City Inspectorate',
    position: '',
    password: '',
    confirmPassword: '',
  });
  const [payrollStatus, setPayrollStatus] = useState<'unchecked' | 'valid' | 'invalid' | 'used'>('unchecked');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePayrollCheck = () => {
    if (!formData.payrollNumber) {
      setPayrollStatus('unchecked');
      return;
    }

    if (isPayrollUsed(formData.payrollNumber)) {
      setPayrollStatus('used');
    } else if (verifyPayrollNumber(formData.payrollNumber)) {
      setPayrollStatus('valid');
    } else {
      setPayrollStatus('invalid');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations
    if (payrollStatus !== 'valid') {
      setError('Please enter a valid payroll number');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const staff: Staff = {
      id: '',
      payrollNumber: formData.payrollNumber,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      position: formData.position,
      dateJoined: new Date().toISOString().split('T')[0],
      password: formData.password,
    };

    const result = registerStaff(staff);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-width-2xl mx-auto py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Login
        </button>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <img 
              src={countyLogo} 
              alt="Nairobi City County Logo"
              className="w-16 h-16 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Staff Registration</h1>
              <p className="text-sm text-gray-600">Nairobi City County Inspectorate</p>
            </div>
          </div>

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-green-900 mb-2">Registration Successful!</h2>
              <p className="text-green-700">Redirecting to login page...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payroll Number Verification */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payroll Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.payrollNumber}
                    onChange={(e) => {
                      setFormData({ ...formData, payrollNumber: e.target.value });
                      setPayrollStatus('unchecked');
                    }}
                    onBlur={handlePayrollCheck}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., NCC2024001"
                    required
                  />
                  <button
                    type="button"
                    onClick={handlePayrollCheck}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
                  >
                    Verify
                  </button>
                </div>
                {payrollStatus === 'valid' && (
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Valid payroll number
                  </p>
                )}
                {payrollStatus === 'invalid' && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    Invalid payroll number. Contact admin.
                  </p>
                )}
                {payrollStatus === 'used' && (
                  <p className="text-sm text-orange-600 mt-1 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    This payroll number is already registered.
                  </p>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="name@nairobi.go.ke"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+254712345678"
                  required
                />
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Position</option>
                  <option value="Senior Inspector">Senior Inspector</option>
                  <option value="Inspector">Inspector</option>
                  <option value="Assistant Inspector">Assistant Inspector</option>
                  <option value="Enforcement Officer">Enforcement Officer</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="At least 6 characters"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={payrollStatus !== 'valid'}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                Register
              </button>
            </form>
          )}
        </div>

        {/* Available Payroll Numbers Info */}
        {!success && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 font-medium mb-2">Available Demo Payroll Numbers:</p>
            <p className="text-xs text-blue-700">
              NCC2024003, NCC2024004, NCC2024005, NCC2023101, NCC2023102, NCC2023103, NCC2023104, NCC2023105
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
