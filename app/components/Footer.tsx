export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-6">
          <div className="flex justify-center items-center space-x-2">
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <h3 className="text-xl font-semibold">Ramika Bahri</h3>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 mx-auto max-w-4xl">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-blue-400">Privacy & Disclaimer</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              This site is for informational and pre-service purposes. All documents are securely stored.
            </p>
          </div>
          
          <div className="pt-6 border-t border-gray-700">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} Ramika Bahri. Aspiring CPA in Canada.
              </p>
              <div className="flex justify-center space-x-6 text-sm text-gray-400">
                <span>Professional Tax Support</span>
                <span>•</span>
                <span>Secure & Confidential</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}