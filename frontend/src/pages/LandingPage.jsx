import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "Digital Attendance",
      description: "Automated attendance tracking with real-time notifications to parents",
      icon: "👥",
      color: "#4F46E5"
    },
    {
      title: "Smart Assignments",
      description: "Digital assignment submission with file uploads and progress tracking",
      icon: "📚",
      color: "#06B6D4"
    },
    {
      title: "Parent-Teacher Connect",
      description: "Seamless communication platform for parent-teacher meetings",
      icon: "🤝",
      color: "#10B981"
    },
    {
      title: "Meal Management",
      description: "Complete meal planning and nutrition tracking system",
      icon: "🍽️",
      color: "#F59E0B"
    },
    {
      title: "Scholarship Portal",
      description: "Streamlined scholarship application and management system",
      icon: "🎓",
      color: "#EF4444"
    },
    {
      title: "Government Compliant",
      description: "Fully compliant with government school regulations and standards",
      icon: "🏛️",
      color: "#8B5CF6"
    }
  ];

  const stats = [
    { number: "50K+", label: "Students Managed", icon: "👨‍🎓" },
    { number: "500+", label: "Government Schools", icon: "🏫" },
    { number: "99.9%", label: "Uptime Guaranteed", icon: "⚡" },
    { number: "24/7", label: "Support Available", icon: "🛟" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/10 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold">🏫</span>
              </div>
              <span className="text-xl font-bold">SchoolPlatform</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-blue-300 transition-colors">Features</a>
              <a href="#why-us" className="hover:text-blue-300 transition-colors">Why Us?</a>
              <a href="#contact" className="hover:text-blue-300 transition-colors">Contact</a>
              <button 
                onClick={() => navigate('/login')}
                className="bg-white text-blue-900 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition-all transform hover:scale-105"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-purple-400/20 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-cyan-400/20 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-block bg-gradient-to-r from-blue-400 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-pulse">
                🎯 Built for Government Schools
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Complete School
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Management Platform
                </span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Streamline your government school operations with our comprehensive platform. 
                From attendance to assignments, meal management to parent communication - 
                everything you need in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/signup')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl transition-all transform hover:scale-105 hover:shadow-blue-500/25"
                >
                  🚀 Get Started Free
                </button>
                <button className="border-2 border-white/30 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all">
                  📖 Learn More
                </button>
              </div>
            </div>

            {/* Hero Animation */}
            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:scale-105 transition-transform duration-500">
                <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-6 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <span className="text-sm text-white/70">SchoolPlatform Dashboard</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white/20 rounded-lg p-4">
                      <div className="text-2xl mb-2">📊</div>
                      <div className="text-sm text-white/70">Total Students</div>
                      <div className="text-xl font-bold">1,247</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4">
                      <div className="text-2xl mb-2">✅</div>
                      <div className="text-sm text-white/70">Present Today</div>
                      <div className="text-xl font-bold">1,156</div>
                    </div>
                  </div>
                  
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-lg">📚</div>
                      <span className="font-semibold">Recent Assignment</span>
                    </div>
                    <div className="text-sm text-white/70">Mathematics - Chapter 5 Problems</div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm">Due: Tomorrow</span>
                      <span className="bg-green-400 text-green-900 px-2 py-1 rounded-full text-xs font-bold">Active</span>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full p-3 animate-bounce">
                  <span className="text-xl">📱</span>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full p-3 animate-pulse">
                  <span className="text-xl">🔔</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/5 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center group hover:scale-110 transition-transform duration-300"
              >
                <div className="text-4xl mb-2 group-hover:animate-bounce">{stat.icon}</div>
                <div className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Features Built for
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Government Schools
              </span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Our platform is specifically designed to meet the unique needs of government educational institutions 
              with compliance, scalability, and ease of use at its core.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`p-6 rounded-2xl border transition-all duration-500 cursor-pointer ${
                    currentFeature === index 
                      ? 'bg-white/10 border-white/30 scale-105 shadow-2xl' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setCurrentFeature(index)}
                >
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${feature.color}20` }}
                    >
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-blue-200">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <div className="text-center mb-6">
                  <div 
                    className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl mb-4 transition-all duration-500"
                    style={{ backgroundColor: `${features[currentFeature].color}20` }}
                  >
                    {features[currentFeature].icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{features[currentFeature].title}</h3>
                  <p className="text-blue-200">{features[currentFeature].description}</p>
                </div>

                {/* Mock Interface */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-gray-600 rounded w-full"></div>
                    <div className="h-3 bg-gray-600 rounded w-5/6"></div>
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div className="h-8 bg-blue-500/30 rounded"></div>
                      <div className="h-8 bg-green-500/30 rounded"></div>
                      <div className="h-8 bg-purple-500/30 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-us" className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Why Choose Us?
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Purpose-Built for
                </span>
                <br />
                <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  Government Schools
                </span>
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Unlike generic school management systems, our platform is specifically designed 
                for government schools with features that address unique challenges, compliance 
                requirements, and operational needs.
              </p>

              <div className="space-y-6">
                {[
                  { icon: "🔒", title: "Government Compliant", desc: "Meets all regulatory requirements" },
                  { icon: "💰", title: "Cost-Effective", desc: "Designed for government school budgets" },
                  { icon: "📱", title: "Mobile-First Design", desc: "Optimized for smartphones and tablets" },
                  { icon: "🌐", title: "Offline Capability", desc: "Works even with poor internet connectivity" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 group hover:scale-105 transition-transform">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center text-xl group-hover:animate-bounce">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-blue-200">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              {/* Desktop View */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-4 border border-white/20 transform hover:scale-105 transition-transform duration-500">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">School Management Dashboard</h3>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/30">
                      <div className="text-2xl mb-2">👥</div>
                      <div className="text-sm text-blue-300">Students</div>
                      <div className="text-2xl font-bold text-white">1,247</div>
                    </div>
                    <div className="bg-green-500/20 p-4 rounded-lg border border-green-500/30">
                      <div className="text-2xl mb-2">👨‍🏫</div>
                      <div className="text-sm text-green-300">Teachers</div>
                      <div className="text-2xl font-bold text-white">89</div>
                    </div>
                    <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-500/30">
                      <div className="text-2xl mb-2">📚</div>
                      <div className="text-sm text-purple-300">Classes</div>
                      <div className="text-2xl font-bold text-white">45</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-white">Daily Attendance</span>
                      <span className="text-green-400 font-bold">92.8%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-white">Active Assignments</span>
                      <span className="text-blue-400 font-bold">24</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-white">Pending PTMs</span>
                      <span className="text-yellow-400 font-bold">12</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Mobile Preview */}
              <div className="absolute -bottom-8 -right-8 w-32 h-56 bg-white/20 backdrop-blur-lg rounded-3xl p-2 border border-white/30 transform rotate-12 hover:rotate-6 transition-transform duration-500">
                <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl h-full p-3">
                  <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-8 bg-white/20 rounded"></div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="h-6 bg-white/20 rounded"></div>
                      <div className="h-6 bg-white/20 rounded"></div>
                    </div>
                    <div className="h-6 bg-white/20 rounded"></div>
                    <div className="h-6 bg-white/20 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Ready to Transform
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Your School?
            </span>
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of government schools already using our platform to streamline 
            their operations and improve educational outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl transition-all transform hover:scale-105 hover:shadow-blue-500/25"
            >
              🚀 Start Free Trial
            </button>
            <button className="border-2 border-white/30 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all">
              📞 Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black/20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold">🏫</span>
                </div>
                <span className="text-lg font-bold">SchoolPlatform</span>
              </div>
              <p className="text-blue-200">
                Empowering government schools with modern digital solutions.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <div className="space-y-2 text-blue-200">
                <div>Features</div>
                <div>Pricing</div>
                <div>Documentation</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <div className="space-y-2 text-blue-200">
                <div>Help Center</div>
                <div>Contact Us</div>
                <div>Training</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <div className="space-y-2 text-blue-200">
                <div>📧 support@schoolplatform.com</div>
                <div>📞 +91 98765 43210</div>
                <div>🌐 www.schoolplatform.com</div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-blue-200">
            <p>&copy; 2025 SchoolPlatform. All rights reserved. Built for Government Schools in India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
