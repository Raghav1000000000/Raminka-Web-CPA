"use client";

import { useEffect, useState } from 'react';
import { ScrollFadeIn, ScrollScale } from './ScrollAnimations';

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTaxForm = () => {
    document.getElementById('tax-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Professional background elements */}
      <div className="absolute inset-0 opacity-60">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,theme(colors.blue.900)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.blue.900)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      {/* Main content */}
      <div className={`relative max-w-6xl text-center transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        {/* Header section */}
        <ScrollFadeIn className="mb-8" delay={200}>
          <div className="relative">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
              <span className="block mb-2">Ramika Bahri</span>
              <span className="block text-3xl sm:text-4xl lg:text-5xl font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Tax Professional
              </span>
            </h1>
          </div>
        </ScrollFadeIn>
        
        <ScrollFadeIn className="mb-8" delay={400}>
          <p className="text-xl sm:text-2xl text-slate-600 font-light mb-4">
            Professional Tax Consultant
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
        </ScrollFadeIn>
        
        <ScrollFadeIn className="mb-12" delay={600}>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Professional Personal Tax Support & Financial Guidance with secure document handling and personalized service
          </p>
        </ScrollFadeIn>
        
        <ScrollFadeIn className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-6 sm:space-y-0" delay={800}>
          <button
            onClick={scrollToContact}
            className="group relative bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-500/25"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>Get Started Today</span>
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </button>
          
          <button
            onClick={scrollToTaxForm}
            className="group border-2 border-slate-300 hover:border-blue-600 text-slate-700 hover:text-blue-600 font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-slate-500/25"
          >
            <span className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
              </svg>
              <span>Tax Service Request</span>
            </span>
          </button>
        </ScrollFadeIn>
        
        {/* Professional achievement highlight */}
        <ScrollScale className="mt-16" delay={1000}>
          <div className="text-center">
            <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 rounded-2xl border border-blue-100/50 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-md">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  200+
                </div>
                <div className="text-lg font-semibold text-slate-700 mt-1">
                  Tax Returns Filed Successfully
                </div>
              </div>
            </div>
          </div>
        </ScrollScale>

        {/* Scroll indicator */}
        <ScrollFadeIn className="mt-20" delay={1200}>
          <div className="flex flex-col items-center space-y-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Explore Services</span>
            <div className="animate-bounce">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}