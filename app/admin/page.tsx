"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../src/lib/supabase";

interface TaxRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  province: string;
  tax_year: string;
  employment_status: string;
  documents_ready: boolean;
  support_needed: boolean;
  notes: string;
  uploaded_file_urls: string[];
  created_at: string;
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [taxRequests, setTaxRequests] = useState<TaxRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileUrls, setFileUrls] = useState<{[key: string]: string}>({});

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setPasswordError("");
      fetchTaxRequests();
    } else {
      setPasswordError("Incorrect password");
    }
  };

  const fetchTaxRequests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tax_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTaxRequests(data || []);
      
      // Generate signed URLs for files
      await generateSignedUrls(data || []);
    } catch (error) {
      console.error('Error fetching tax requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSignedUrls = async (requests: TaxRequest[]) => {
    const urlMap: {[key: string]: string} = {};
    
    for (const request of requests) {
      if (request.uploaded_file_urls && request.uploaded_file_urls.length > 0) {
        for (const fileUrl of request.uploaded_file_urls) {
          try {
            // Extract filename from URL
            const urlParts = fileUrl.split('/');
            const fileName = urlParts[urlParts.length - 1];
            
            const { data, error } = await supabase.storage
              .from('tax-documents')
              .createSignedUrl(fileName, 3600); // 1 hour expiry

            if (!error && data) {
              urlMap[fileUrl] = data.signedUrl;
            } else {
              urlMap[fileUrl] = fileUrl; // Fallback to original URL
            }
          } catch (error) {
            console.error('Error generating signed URL:', error);
            urlMap[fileUrl] = fileUrl; // Fallback to original URL
          }
        }
      }
    }
    
    setFileUrls(urlMap);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <svg className="w-12 h-12 text-blue-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600">Enter password to access</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter admin password"
                required
              />
              {passwordError && (
                <p className="mt-2 text-sm text-red-600">{passwordError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Access Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">Tax Requests Dashboard</h1>
                <p className="text-blue-100 mt-2">Manage client submissions and documents</p>
              </div>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 animate-spin text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">Loading submissions...</span>
                </div>
              </div>
            ) : taxRequests.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No submissions yet</h3>
                <p className="text-gray-600">Tax request submissions will appear here</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    All Submissions ({taxRequests.length})
                  </h2>
                </div>

                {/* Mobile-first responsive table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client Info
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          Tax Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Documents
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                          Submitted
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {taxRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50">
                          {/* Client Info */}
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="font-medium text-gray-900">{request.name}</div>
                              <div className="text-sm text-gray-600">{request.email}</div>
                              <div className="text-sm text-gray-600">{request.phone}</div>
                              <div className="md:hidden text-sm text-gray-500 mt-2">
                                <div>{request.province} • {request.tax_year}</div>
                                <div>{request.employment_status}</div>
                              </div>
                            </div>
                          </td>

                          {/* Tax Details - Hidden on mobile */}
                          <td className="px-6 py-4 hidden md:table-cell">
                            <div className="space-y-1">
                              <div className="text-sm text-gray-900">{request.province}</div>
                              <div className="text-sm text-gray-600">Tax Year: {request.tax_year}</div>
                              <div className="text-sm text-gray-600">{request.employment_status}</div>
                            </div>
                          </td>

                          {/* Status - Hidden on mobile/tablet */}
                          <td className="px-6 py-4 hidden lg:table-cell">
                            <div className="space-y-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                request.documents_ready 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {request.documents_ready ? 'Docs Ready' : 'Needs Help'}
                              </span>
                              {request.support_needed && (
                                <div className="text-xs text-orange-600">Support Needed</div>
                              )}
                            </div>
                          </td>

                          {/* Documents */}
                          <td className="px-6 py-4">
                            {request.uploaded_file_urls && request.uploaded_file_urls.length > 0 ? (
                              <div className="space-y-1">
                                {request.uploaded_file_urls.map((fileUrl, index) => {
                                  const fileName = fileUrl.split('/').pop() || `Document ${index + 1}`;
                                  const signedUrl = fileUrls[fileUrl] || fileUrl;
                                  return (
                                    <a
                                      key={index}
                                      href={signedUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                      </svg>
                                      <span className="truncate max-w-[120px]">{fileName}</span>
                                    </a>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">No files</span>
                            )}
                          </td>

                          {/* Submitted Date - Hidden on mobile */}
                          <td className="px-6 py-4 hidden sm:table-cell">
                            <div className="text-sm text-gray-600">
                              {new Date(request.created_at).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(request.created_at).toLocaleTimeString()}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile-only submission details */}
                <div className="lg:hidden mt-8 space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Additional Details</h3>
                  {taxRequests.map((request) => (
                    <div key={`mobile-${request.id}`} className="bg-gray-50 rounded-lg p-4">
                      <div className="font-medium text-gray-900 mb-2">{request.name}</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <div className="mt-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              request.documents_ready 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {request.documents_ready ? 'Documents Ready' : 'Needs Help'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Submitted:</span>
                          <div className="mt-1 text-gray-900">
                            {new Date(request.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      {request.notes && (
                        <div className="mt-3">
                          <span className="text-gray-500 text-sm">Notes:</span>
                          <p className="mt-1 text-gray-900 text-sm">{request.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}