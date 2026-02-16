import { ScrollFadeIn, ScrollScale } from './ScrollAnimations';

export default function Services() {
  const services = [
    {
      title: "Personal Tax Support",
      description: "Comprehensive assistance with your personal tax returns and planning.",
      icon: (
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">
          T
        </div>
      )
    },
    {
      title: "Secure Information Handling",
      description: "Your sensitive tax information is handled with the highest security standards.",
      icon: (
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </div>
      )
    },
    {
      title: "Clear Communication",
      description: "Transparent, easy-to-understand explanations throughout the process.",
      icon: (
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        </div>
      )
    }
  ];

  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <ScrollFadeIn className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
            Professional Tax Services
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-4"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive tax solutions designed to meet your needs with expertise, security, and clear communication.
          </p>
        </ScrollFadeIn>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ScrollFadeIn
              key={index}
              delay={200 + index * 200}
              className="group text-center p-8 rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex justify-center mb-6 transform transition-transform duration-300 group-hover:scale-110">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}