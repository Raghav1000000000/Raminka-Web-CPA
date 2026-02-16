'use client';

import { useState, useEffect } from 'react';

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-float-delayed"></div>
        
        {/* Floating Particles */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-blue-400/30 rounded-full particle-${i + 1}`}
          />
        ))}
      </div>

      <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center space-x-3 mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity animate-pulse-slow"></div>
                <div className="relative bg-slate-800 p-3 rounded-full border border-slate-600">
                  <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Ramika Bahri
                </h3>
                <p className="text-sm text-slate-400 mt-1">Professional Tax Services</p>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Services Column */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-200 flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Services</span>
              </h4>
              <ul className="space-y-2 text-slate-400">
                {['Personal Tax Returns', 'Tax Consultation', 'Document Review', 'CRA Support'].map((service, index) => (
                  <li 
                    key={service}
                    className="flex items-center space-x-2 hover:text-blue-400 transition-colors cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-200 flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-200"></div>
                <span>Contact</span>
              </h4>
              <div className="space-y-3 text-slate-400">
                <div className="flex items-center space-x-3 hover:text-purple-400 transition-colors">
                  <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-sm">Professional Email</span>
                </div>
                <div className="flex items-center space-x-3 hover:text-purple-400 transition-colors">
                  <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Canada-wide Services</span>
                </div>
              </div>
            </div>

            {/* Credentials Column */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-200 flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse animation-delay-300"></div>
                <span>Credentials</span>
              </h4>
              <div className="space-y-3 text-slate-400">
                <div className="flex items-center space-x-3">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Tax Consultant</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Secure & Confidential</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-700/50">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
              {/* Copyright & Legal Links */}
              <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-6 justify-center lg:justify-start">
                <div className="flex items-center space-x-2 justify-center lg:justify-start">
                  <p className="text-slate-400 text-sm">
                    © {new Date().getFullYear()} Ramika Bahri. All rights reserved.
                  </p>
                  <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                  <span className="text-slate-500 text-sm">Professional Tax Consultant</span>
                </div>
                
                {/* Legal Links */}
                <div className="flex items-center justify-center lg:justify-start space-x-4 text-sm">
                  <a 
                    href="/privacy" 
                    className="text-slate-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    Privacy Policy
                  </a>
                  <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                  <a 
                    href="/terms" 
                    className="text-slate-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    Terms of Service
                  </a>
                  <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                  <a 
                    href="mailto:info@ramikabahri.ca" 
                    className="text-slate-400 hover:text-purple-400 transition-colors duration-200"
                  >
                    Contact
                  </a>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex items-center justify-center lg:justify-end space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-400">Active Services</span>
                </div>
                <div className="w-px h-4 bg-slate-600"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-200"></div>
                  <span className="text-slate-400">Secure Platform</span>
                </div>
              </div>
            </div>

            {/* Professional Badge */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-full border border-slate-600/30">
                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs text-slate-400 font-medium">Professional Tax Services Provider</span>
                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}