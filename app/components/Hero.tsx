"use client";

export default function Hero() {
  const scrollToContact = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTaxForm = () => {
    document.getElementById('tax-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-16 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-indigo-200 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-purple-200 rounded-full animate-ping delay-2000"></div>
      </div>
      
      <div className="relative max-w-5xl text-center animate-fade-in">
        <div className="mb-6 animate-slide-down">
          <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl lg:text-7xl mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Ramika Bahri
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full animate-pulse"></div>
        </div>
        
        <p className="mb-8 text-xl text-gray-700 sm:text-2xl lg:text-3xl font-light animate-slide-up">
          Aspiring CPA in Canada
        </p>
        
        <p className="mb-12 text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in delay-500">
          Professional Personal Tax Support & Financial Guidance
        </p>
        
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-6 sm:space-y-0 animate-slide-up delay-700">
          <button
            onClick={scrollToContact}
            className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span className="relative z-10">Get Started Today</span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </button>
          
          <button
            onClick={scrollToTaxForm}
            className="group relative overflow-hidden rounded-lg border-2 border-blue-600 px-8 py-4 text-lg font-semibold text-blue-600 transition-all duration-300 hover:text-white hover:border-indigo-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span className="relative z-10">Tax Service Request</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></div>
          </button>
        </div>
        
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto animate-fade-in delay-1000">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">50+</div>
            <div className="text-sm text-gray-600">Tax Returns</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">100%</div>
            <div className="text-sm text-gray-600">Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">5★</div>
            <div className="text-sm text-gray-600">Client Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}