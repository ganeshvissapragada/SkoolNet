import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    schoolName: '',
    principalName: '',
    email: '',
    phone: '',
    state: '',
    district: '',
    schoolType: 'government'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just redirect to login
    alert('Thank you for your interest! We will contact you soon to set up your school account.');
    navigate('/login');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
      {/* Navigation */}
      <nav className="p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">🏫</span>
            </div>
            <span className="text-xl font-bold">SchoolPlatform</span>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="text-blue-200 hover:text-white transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Get Started with SchoolPlatform
            </span>
          </h1>
          <p className="text-xl text-blue-100">
            Register your government school and transform your educational management
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">School Name *</label>
                <input
                  type="text"
                  name="schoolName"
                  required
                  value={formData.schoolName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-blue-200"
                  placeholder="Government Senior Secondary School"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Principal Name *</label>
                <input
                  type="text"
                  name="principalName"
                  required
                  value={formData.principalName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-blue-200"
                  placeholder="Dr. Principal Name"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-blue-200"
                  placeholder="principal@schoolname.edu"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-blue-200"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">State *</label>
                <select
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  <option value="" className="text-gray-800">Select State</option>
                  <option value="andhra-pradesh" className="text-gray-800">Andhra Pradesh</option>
                  <option value="karnataka" className="text-gray-800">Karnataka</option>
                  <option value="tamil-nadu" className="text-gray-800">Tamil Nadu</option>
                  <option value="telangana" className="text-gray-800">Telangana</option>
                  <option value="maharashtra" className="text-gray-800">Maharashtra</option>
                  <option value="other" className="text-gray-800">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">District *</label>
                <input
                  type="text"
                  name="district"
                  required
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-blue-200"
                  placeholder="District Name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">School Type</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="schoolType"
                    value="government"
                    checked={formData.schoolType === 'government'}
                    onChange={handleChange}
                    className="text-blue-500"
                  />
                  <span>Government School</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="schoolType"
                    value="government-aided"
                    checked={formData.schoolType === 'government-aided'}
                    onChange={handleChange}
                    className="text-blue-500"
                  />
                  <span>Government Aided</span>
                </label>
              </div>
            </div>

            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">ℹ️</span>
                <div>
                  <h4 className="font-semibold mb-2">What happens next?</h4>
                  <ul className="text-sm text-blue-200 space-y-1">
                    <li>• Our team will verify your school details</li>
                    <li>• We'll schedule a demo call within 24 hours</li>
                    <li>• Free setup and training will be provided</li>
                    <li>• Your school will be live within 48 hours</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl transition-all transform hover:scale-105 hover:shadow-blue-500/25"
            >
              🚀 Register Your School
            </button>

            <div className="text-center text-sm text-blue-200">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                Login here
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
