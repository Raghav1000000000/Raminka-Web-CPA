import { supabase } from '../../src/lib/supabase'

export default async function TestConsentPage() {
  // Test database connection and data retrieval
  let consents = []
  let stats = null
  let error = null

  try {
    // Test 1: Fetch recent consents
    const { data: consentsData, error: consentsError } = await supabase
      .from('client_consents')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (consentsError) throw consentsError
    consents = consentsData || []

    // Test 2: Get statistics
    const { data: statsData, error: statsError } = await supabase
      .rpc('get_consent_statistics')

    if (statsError) throw statsError
    stats = statsData?.[0] || null

  } catch (err: any) {
    error = err.message
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Consent Module Test Results
          </h1>

          {/* Database Connection Test */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🔗 Database Connection
            </h2>
            <div className={`p-4 rounded-lg ${error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
              {error ? (
                <>
                  <div className="flex items-center text-red-700 font-semibold mb-2">
                    <span className="mr-2">❌</span>
                    Connection Failed
                  </div>
                  <p className="text-red-600 text-sm">{error}</p>
                </>
              ) : (
                <div className="flex items-center text-green-700 font-semibold">
                  <span className="mr-2">✅</span>
                  Successfully connected to Supabase
                </div>
              )}
            </div>
          </div>

          {/* Statistics Test */}
          {stats && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                📊 Consent Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.total_consents}
                  </div>
                  <div className="text-sm text-blue-800">Total Consents</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.consents_today}
                  </div>
                  <div className="text-sm text-green-800">Today</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.consents_this_week}
                  </div>
                  <div className="text-sm text-purple-800">This Week</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.consents_this_month}
                  </div>
                  <div className="text-sm text-orange-800">This Month</div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Signature Types:</h3>
                <div className="flex space-x-4 text-sm">
                  <span className="text-gray-600">
                    Draw: {stats.signature_types?.draw || 0}
                  </span>
                  <span className="text-gray-600">
                    Upload: {stats.signature_types?.upload || 0}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Recent Consents Test */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              📝 Recent Consent Forms ({consents.length})
            </h2>
            {consents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Signature</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consents.map((consent: any, index: number) => (
                      <tr key={consent.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 text-sm text-gray-900">{consent.client_name}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{consent.client_email}</td>
                        <td className="px-4 py-2 text-sm">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            consent.signature_type === 'draw' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {consent.signature_type === 'draw' ? '✏️ Draw' : '📸 Photo'}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {new Date(consent.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            consent.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {consent.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No consent forms found. Try submitting one first!
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <a 
              href="/consent" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Test Consent Form
            </a>
            <a 
              href="/admin" 
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Test Admin Dashboard
            </a>
            <a 
              href="/" 
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Back to Home
            </a>
          </div>

          {/* Setup Instructions */}
          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">📋 Setup Checklist</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>✅ Run the SQL setup script in Supabase</li>
              <li>✅ Configure your .env.local file with Supabase credentials</li>
              <li>✅ Test the consent form submission</li>
              <li>✅ Test the admin dashboard</li>
              <li>✅ Test signature photo upload in Storage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}