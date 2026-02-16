"use client"

import { useState, useRef } from 'react'
import { supabase } from '../../src/lib/supabase'
import Link from 'next/link'

interface SignatureFormProps {
  clientInfo?: {
    fullName: string
    email: string
    phone: string
  }
}

export default function SignatureConsentForm({ clientInfo }: SignatureFormProps) {
  const [formData, setFormData] = useState({
    clientName: clientInfo?.fullName || '',
    clientEmail: clientInfo?.email || '',
    clientPhone: clientInfo?.phone || '',
    consentDate: new Date().toISOString().split('T')[0],
    signature: '',
    signaturePhoto: null as File | null,
    ipAddress: '',
    userAgent: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isDrawing, setIsDrawing] = useState(false)
  const [signatureType, setSignatureType] = useState<'draw' | 'upload'>('draw')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [signatureEmpty, setSignatureEmpty] = useState(true)
  const [photoPreview, setPhotoPreview] = useState<string>('')

  // Get user's IP and user agent for legal verification
  useState(() => {
    // Get IP address from a service (in production, use your backend)
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        setFormData(prev => ({
          ...prev,
          ipAddress: data.ip,
          userAgent: navigator.userAgent
        }))
      })
      .catch(() => {
        setFormData(prev => ({
          ...prev,
          ipAddress: '127.0.0.1',
          userAgent: navigator.userAgent
        }))
      })
  })

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    setSignatureEmpty(false)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.beginPath()
    
    // Handle both mouse and touch events
    let clientX, clientY
    if ('touches' in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }
    
    ctx.moveTo(clientX - rect.left, clientY - rect.top)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Handle both mouse and touch events
    let clientX, clientY
    if ('touches' in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#1f2937'
    ctx.lineTo(clientX - rect.left, clientY - rect.top)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (!canvas) return

    // Save signature as data URL
    const signatureDataURL = canvas.toDataURL()
    setFormData(prev => ({ ...prev, signature: signatureDataURL }))
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setSignatureEmpty(true)
    setFormData(prev => ({ ...prev, signature: '' }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.includes('image/')) {
      alert('Please upload an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setFormData(prev => ({ ...prev, signaturePhoto: file }))
    setSignatureEmpty(false)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const clearPhotoSignature = () => {
    setFormData(prev => ({ ...prev, signaturePhoto: null }))
    setPhotoPreview('')
    setSignatureEmpty(true)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus('idle')

    try {
      // Validate required fields
      if (!formData.clientName || !formData.clientEmail) {
        throw new Error('Please complete all required fields')
      }

      // Validate signature (either drawn or photo uploaded)
      if (signatureType === 'draw' && (!formData.signature || signatureEmpty)) {
        throw new Error('Please provide your signature by drawing')
      }
      if (signatureType === 'upload' && !formData.signaturePhoto) {
        throw new Error('Please upload your signature photo')
      }

      let signatureUrl = ''
      
      // If signature photo is uploaded, store it in Supabase Storage
      if (signatureType === 'upload' && formData.signaturePhoto) {
        const fileName = `signature_${Date.now()}_${Math.random().toString(36).substring(2)}.${formData.signaturePhoto.name.split('.').pop()}`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('signatures')
          .upload(fileName, formData.signaturePhoto)

        if (uploadError) throw uploadError

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('signatures')
          .getPublicUrl(fileName)
        
        signatureUrl = urlData.publicUrl
      }

      // Submit consent form to Supabase
      const { data, error } = await supabase
        .from('client_consents')
        .insert([{
          client_name: formData.clientName,
          client_email: formData.clientEmail,
          client_phone: formData.clientPhone,
          consent_date: formData.consentDate,
          signature_data: signatureType === 'draw' ? formData.signature : null,
          signature_photo_url: signatureType === 'upload' ? signatureUrl : null,
          signature_type: signatureType,
          ip_address: formData.ipAddress,
          user_agent: formData.userAgent,
          consent_type: 'tax_service_agreement',
          created_at: new Date().toISOString()
        }])

      if (error) throw error

      setStatus('success')
      // Reset form
      setFormData({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        consentDate: new Date().toISOString().split('T')[0],
        signature: '',
        signaturePhoto: null,
        ipAddress: formData.ipAddress,
        userAgent: formData.userAgent
      })
      clearSignature()
      clearPhotoSignature()

    } catch (error: any) {
      console.error('Consent form submission error:', error)
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center bg-white rounded-2xl shadow-lg">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Consent Form Submitted Successfully</h3>
        <p className="text-gray-600 mb-6">
          Thank you for providing your consent. Your digital signature has been securely recorded and can be accessed by our admin team.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setStatus('idle')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Submit Another Form
          </button>
          <Link
            href="/"
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-center"
          >
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header with Return to Home */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-300 font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Return to Home</span>
          </Link>
        </div>
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Official Consent Form</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Tax Service Consent & Agreement
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please review and sign this consent form to authorize our tax preparation services. This serves as your official agreement and digital signature.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Legal Agreement Text */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Consent & Authorization Agreement</h3>
            <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
              <p>By signing this form, I, the undersigned taxpayer, hereby:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Authorize Ramika Bahri Tax Services to prepare and file my tax return(s) for the specified tax year(s)</li>
                <li>Confirm that all information provided is true, complete, and accurate to the best of my knowledge</li>
                <li>Understand that I am ultimately responsible for the accuracy of my tax return</li>
                <li>Agree to pay the agreed-upon fees for tax preparation services</li>
                <li>Grant permission to communicate with the Canada Revenue Agency (CRA) on my behalf regarding this tax return</li>
                <li>Acknowledge that all documents and information will be kept confidential and secure</li>
                <li>Understand that this consent may be revoked in writing at any time</li>
              </ul>
              <p className="font-semibold mt-4">
                This digital signature has the same legal effect as a handwritten signature and is legally binding.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="clientName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  required
                  value={formData.clientName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                  placeholder="As it appears on your ID"
                />
              </div>

              <div>
                <label htmlFor="clientEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="clientEmail"
                  name="clientEmail"
                  required
                  value={formData.clientEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="clientPhone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="clientPhone"
                  name="clientPhone"
                  value={formData.clientPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="consentDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  Consent Date *
                </label>
                <input
                  type="date"
                  id="consentDate"
                  name="consentDate"
                  required
                  value={formData.consentDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                />
              </div>
            </div>

            {/* Digital Signature Section */}
            <div className="space-y-6">
              <div className="flex justify-center mb-4">
                <div className="inline-flex bg-gray-100 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSignatureType('draw')
                      clearPhotoSignature()
                      setSignatureEmpty(!formData.signature)
                    }}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      signatureType === 'draw'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    Draw Signature
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSignatureType('upload')
                      clearSignature()
                      setSignatureEmpty(!formData.signaturePhoto)
                    }}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      signatureType === 'upload'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    Upload Photo
                  </button>
                </div>
              </div>

              {signatureType === 'draw' ? (
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Digital Signature * <span className="text-gray-500">(Draw your signature below)</span>
                  </label>
                  
                  <div className="border-2 border-gray-300 rounded-xl p-4 bg-gray-50">
                    <canvas
                      ref={canvasRef}
                      width={600}
                      height={200}
                      className="w-full h-32 bg-white border border-gray-200 rounded-lg cursor-crosshair touch-manipulation"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />
                    
                    <div className="flex justify-between items-center mt-3">
                      <p className="text-xs text-gray-500">Sign above using your mouse or finger</p>
                      <button
                        type="button"
                        onClick={clearSignature}
                        className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Clear Signature
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Upload Signature Photo * <span className="text-gray-500">(JPG, PNG up to 5MB)</span>
                  </label>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 text-center">
                    {photoPreview ? (
                      <div className="space-y-4">
                        <img 
                          src={photoPreview} 
                          alt="Signature preview" 
                          className="max-h-32 mx-auto rounded-lg border border-gray-200"
                        />
                        <div className="flex justify-center space-x-3">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            Change Photo
                          </button>
                          <button
                            type="button"
                            onClick={clearPhotoSignature}
                            className="text-sm text-red-600 hover:text-red-800 font-semibold"
                          >
                            Remove Photo
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <svg className="mx-auto w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" />
                        </svg>
                        <div>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            Click to upload signature photo
                          </button>
                          <p className="text-xs text-gray-500 mt-1">or drag and drop your signature image here</p>
                        </div>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </div>

            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm">
                  There was an error submitting your consent form. Please try again.
                </p>
              </div>
            )}

            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting || signatureEmpty}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" className="opacity-75"></path>
                    </svg>
                    <span>Submitting...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Submit Official Consent</span>
                  </span>
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              By submitting this form, you acknowledge that your digital signature is legally binding and equivalent to a handwritten signature.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}