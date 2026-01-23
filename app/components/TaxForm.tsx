"use client";

import { useState } from "react";
import { supabase } from "../../src/lib/supabase";

export default function TaxForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    province: "",
    taxYear: "",
    employmentStatus: "",
    documentsReady: "",
    notes: ""
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isDragOver, setIsDragOver] = useState(false);

  const provinces = [
    "Alberta", "British Columbia", "Manitoba", "New Brunswick", 
    "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", 
    "Nunavut", "Ontario", "Prince Edward Island", "Quebec", 
    "Saskatchewan", "Yukon Territory"
  ];

  const employmentStatuses = [
    "Employed", "Self-employed", "Student", "Other"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsUploading(true);
    setStatus('idle');

    try {
      let uploadedFileUrls: string[] = [];

      // Upload files to Supabase Storage if any files are selected
      if (uploadedFiles.length > 0) {
        setUploadProgress(0);
        
        try {
          for (let i = 0; i < uploadedFiles.length; i++) {
            const file = uploadedFiles[i];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { data, error } = await supabase.storage
              .from('tax-documents')
              .upload(fileName, file);

            if (error) {
              console.error('Storage upload error:', error);
              // Continue without files if storage fails
              break;
            }

            // Get public URL for the uploaded file
            const { data: { publicUrl } } = supabase.storage
              .from('tax-documents')
              .getPublicUrl(fileName);

            uploadedFileUrls.push(publicUrl);
            setUploadProgress(((i + 1) / uploadedFiles.length) * 100);
          }
        } catch (storageError) {
          console.warn('File upload failed, continuing without files:', storageError);
          uploadedFileUrls = [];
        }
      }

      setIsUploading(false);

      // Save form data to tax_requests table
      const { error } = await supabase
        .from('tax_requests')
        .insert([
          {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            province: formData.province,
            tax_year: formData.taxYear,
            employment_status: formData.employmentStatus,
            documents_ready: formData.documentsReady === 'yes',
            support_needed: formData.documentsReady === 'no',
            notes: formData.notes,
            uploaded_file_urls: uploadedFileUrls
          }
        ]);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      setStatus('success');
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        province: "",
        taxYear: "",
        employmentStatus: "",
        documentsReady: "",
        notes: ""
      });
      setUploadedFiles([]);
      setUploadProgress(0);

    } catch (error) {
      console.error('Error submitting tax form:', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024); // 10MB limit
      setUploadedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => {
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      return allowedTypes.includes(file.type) && file.size <= 10 * 1024 * 1024;
    });
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return (
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'jpg':
      case 'jpeg':
      case 'png':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'doc':
      case 'docx':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'xls':
      case 'xlsx':
        return (
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <section id="tax-form" className="bg-gradient-to-br from-indigo-50 to-purple-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
            </svg>
            <span>Quick & Secure</span>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
            Start Your Tax Service
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete this form to begin your personalized tax preparation service. All information is kept strictly confidential.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 animate-slide-up border border-gray-100">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Tax Service Request</h3>
              <div className="flex items-center space-x-2 text-green-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Secure Form</span>
              </div>
            </div>
            <div className="h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 mt-2 rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group">
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 group-hover:border-gray-300"
                  placeholder="As it appears on your ID"
                />
              </div>

              <div className="group">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 group-hover:border-gray-300"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="group">
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 group-hover:border-gray-300"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="group">
                <label htmlFor="province" className="block text-sm font-semibold text-gray-700 mb-2">
                  Province *
                </label>
                <select
                  id="province"
                  name="province"
                  required
                  value={formData.province}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 group-hover:border-gray-300"
                >
                  <option value="">Select your province</option>
                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="group">
                <label htmlFor="taxYear" className="block text-sm font-semibold text-gray-700 mb-2">
                  Tax Year *
                </label>
                <input
                  type="text"
                  id="taxYear"
                  name="taxYear"
                  required
                  value={formData.taxYear}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 group-hover:border-gray-300"
                  placeholder="2024, 2023, etc."
                />
              </div>

              <div className="group">
                <label htmlFor="employmentStatus" className="block text-sm font-semibold text-gray-700 mb-2">
                  Employment Status *
                </label>
                <select
                  id="employmentStatus"
                  name="employmentStatus"
                  required
                  value={formData.employmentStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 group-hover:border-gray-300"
                >
                  <option value="">Select employment status</option>
                  {employmentStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Do you have all your tax documents ready? *
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-300 hover:border-gray-300 hover:bg-gray-50">
                  <input
                    type="radio"
                    name="documentsReady"
                    value="yes"
                    checked={formData.documentsReady === "yes"}
                    onChange={handleChange}
                    className="mr-3 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Yes, I'm ready!</div>
                    <div className="text-sm text-gray-600">I have all my documents</div>
                  </div>
                </label>
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-300 hover:border-gray-300 hover:bg-gray-50">
                  <input
                    type="radio"
                    name="documentsReady"
                    value="no"
                    checked={formData.documentsReady === "no"}
                    onChange={handleChange}
                    className="mr-3 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Need help</div>
                    <div className="text-sm text-gray-600">Help gathering documents</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="group">
              <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 group-hover:border-gray-300 resize-vertical"
                placeholder="Tell me about your specific tax situation, any questions, or special circumstances..."
              />
            </div>

            {/* Document Upload Section */}
            <div className="space-y-6 border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Upload Documents</h4>
                    <p className="text-sm text-gray-600">Add your tax documents (optional)</p>
                  </div>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="bg-blue-50 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-blue-700">
                      {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                )}
              </div>
              
              <div 
                className={`group relative transition-all duration-300 ${
                  isDragOver 
                    ? 'border-blue-400 bg-blue-50 scale-[1.02]' 
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="relative border-2 border-dashed rounded-xl p-8 text-center">
                  <input
                    type="file"
                    id="documents"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  
                  <div className="space-y-4">
                    <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isDragOver 
                        ? 'bg-blue-100' 
                        : 'bg-gray-100 group-hover:bg-blue-100'
                    }`}>
                      <svg className={`w-6 h-6 transition-colors duration-300 ${
                        isDragOver 
                          ? 'text-blue-600' 
                          : 'text-gray-400 group-hover:text-blue-600'
                      }`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    
                    <div className="space-y-2">
                      <div className={`text-lg font-semibold transition-colors duration-300 ${
                        isDragOver ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        {isDragOver ? 'Drop your files here' : 'Drag & drop your files here'}
                      </div>
                      
                      <p className="text-gray-500">
                        or{' '}
                        <span className="text-blue-600 font-semibold hover:text-blue-700 cursor-pointer">
                          browse to choose files
                        </span>
                      </p>
                      
                      <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 pt-2">
                        <span>PDF, JPG, PNG, DOC, XLS</span>
                        <span>•</span>
                        <span>Max 10MB per file</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* File Types Guide */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h5 className="font-medium text-blue-900 mb-2">Helpful document types to include:</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-blue-700">
                      <div>• T4, T4A, T5 slips</div>
                      <div>• Income statements</div>
                      <div>• Expense receipts</div>
                      <div>• RRSP contributions</div>
                      <div>• Medical receipts</div>
                      <div>• Donation receipts</div>
                    </div>
                  </div>
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-4">
                  <h5 className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Files Ready to Upload ({uploadedFiles.length})</span>
                  </h5>
                  
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="group flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          {getFileIcon(file.name)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                              <span>•</span>
                              <span className="uppercase">{file.name.split('.').pop()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-all duration-200 opacity-0 group-hover:opacity-100"
                          title="Remove file"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-start space-x-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium text-gray-700">Secure & Confidential</p>
                  <p className="text-xs">Your documents are encrypted and stored securely. They'll only be used for your tax preparation and will be deleted after completion.</p>
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && uploadedFiles.length > 0 && (
                <div className="space-y-3 bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-900">Uploading documents...</p>
                        <p className="text-xs text-blue-700">Please wait while we securely upload your files</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-blue-700">{Math.round(uploadProgress)}%</span>
                  </div>
                  
                  <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center space-y-4 pt-6">
              {status === 'success' && (
                <div className="w-full p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <div className="flex items-center justify-center space-x-2 text-green-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Your tax request has been submitted successfully.</span>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                  <div className="flex items-center justify-center space-x-2 text-red-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Sorry, there was an error submitting your request. Please try again.</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-12 rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="relative z-10 flex items-center space-x-3">
                  {isSubmitting || isUploading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      <span>
                        {isUploading ? 'Uploading Documents...' : 'Submitting Request...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>Submit Tax Request</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </span>
                {!isSubmitting && !isUploading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}