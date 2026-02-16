import { ScrollFadeIn } from './ScrollAnimations';

export default function TrustStrip() {
  const trustItems = [
    { 
      icon: (
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-md flex items-center justify-center text-white">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </div>
      ), 
      text: "Secure Forms" 
    },
    { 
      icon: (
        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-md flex items-center justify-center text-white font-bold text-sm">
          🇨🇦
        </div>
      ), 
      text: "Canada-Based Services" 
    },
    { 
      icon: (
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-md flex items-center justify-center text-white">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      ), 
      text: "Privacy First" 
    },
    { 
      icon: (
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md flex items-center justify-center text-white">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
          </svg>
        </div>
      ), 
      text: "Professional Support" 
    }
  ];

  return (
    <section className="bg-gradient-to-r from-gray-50 to-blue-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <ScrollFadeIn className="text-center mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Why Choose Ramika Bahri</h3>
          <div className="h-0.5 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
        </ScrollFadeIn>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {trustItems.map((item, index) => (
            <ScrollFadeIn
              key={index}
              delay={200 + index * 150}
              className="flex flex-col items-center space-y-3 group hover:scale-105 transition-transform duration-300"
            >
              <div className="transform transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </div>
              <span className="text-sm font-semibold text-gray-700 sm:text-base group-hover:text-blue-600 transition-colors">
                {item.text}
              </span>
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}