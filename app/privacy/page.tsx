export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Home Navigation */}
        <div className="mb-8">
          <a 
            href="/" 
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors group"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Back to Home</span>
          </a>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: January 2026</p>
          </div>

          <div className="prose max-w-none">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
              <p className="text-blue-800 font-medium">
                This Privacy Policy complies with the Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial privacy laws in Canada.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              Under PIPEDA and Canadian privacy law, we collect only the personal information necessary to provide tax preparation services:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Personal identification information (full legal name, Social Insurance Number when required, contact details)</li>
              <li>Tax-related financial information (T4, T4A, T5 slips, employment income, investment income)</li>
              <li>Expense documentation (receipts for medical expenses, charitable donations, eligible business expenses)</li>
              <li>Banking information for direct deposit of refunds (if requested)</li>
              <li>Supporting documents (Notice of Assessment from previous years, RRSP contributions, childcare receipts)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Legal Basis for Collection (PIPEDA Compliance)</h2>
            <p className="text-gray-700 mb-4">
              Your personal information is collected under the following lawful purposes as defined by PIPEDA:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li><strong>Explicit Consent:</strong> You provide clear consent for tax preparation services</li>
              <li><strong>Legal Obligation:</strong> Required for Canada Revenue Agency (CRA) filing requirements</li>
              <li><strong>Legitimate Interest:</strong> Necessary for professional tax consultation and advice</li>
              <li><strong>Contractual Necessity:</strong> Required to fulfill our tax service agreement</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              Your personal information is used exclusively for the following purposes in accordance with Canadian tax law:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Preparing and electronically filing your Canadian tax returns with the CRA</li>
              <li>Calculating federal and provincial tax obligations and potential refunds</li>
              <li>Providing tax planning advice for current and future tax years</li>
              <li>Communicating with you about your tax situation and CRA correspondence</li>
              <li>Maintaining records as required by CRA regulations (minimum 6 years)</li>
              <li>Responding to CRA inquiries or audits on your behalf (with your consent)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information Storage and Security</h2>
            <p className="text-gray-700 mb-4">
              Your personal information is protected through Canadian-compliant security measures:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Data stored on Canadian servers or servers with adequate privacy protection</li>
              <li>Encryption in transit and at rest using industry-standard protocols</li>
              <li>Access controls limiting information to authorized personnel only</li>
              <li>Regular security audits and updates to maintain protection standards</li>
              <li>Physical and electronic safeguards meeting PIPEDA requirements</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Access to Your Information</h2>
            <p className="text-gray-700 mb-6">
              Under PIPEDA, access to your personal information is strictly limited to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Ramika Bahri (authorized tax preparer) for service delivery</li>
              <li>Canada Revenue Agency (CRA) as required by Canadian tax law</li>
              <li>Provincial tax authorities where applicable</li>
              <li>No sharing with third parties without your explicit written consent</li>
              <li>Court orders or legal proceedings as required by Canadian law</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Data Retention (Canadian Law Compliance)</h2>
            <p className="text-gray-700 mb-6">
              In accordance with CRA requirements and Canadian privacy law:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li><strong>Tax Records:</strong> Maintained for 6 years as required by the Income Tax Act (Canada)</li>
              <li><strong>Personal Information:</strong> Retained only as long as necessary for tax and legal purposes</li>
              <li><strong>Electronic Files:</strong> Securely deleted after retention period unless legal hold applies</li>
              <li><strong>Physical Documents:</strong> Shredded or returned to client after retention period</li>
              <li><strong>Backup Systems:</strong> Purged according to the same retention schedule</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Your Rights Under PIPEDA</h2>
            <p className="text-gray-700 mb-4">
              As a Canadian resident, you have the following rights under PIPEDA and provincial privacy laws:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li><strong>Access:</strong> Request access to your personal information we hold</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Withdrawal:</strong> Withdraw consent (subject to legal and contractual obligations)</li>
              <li><strong>Complaint:</strong> File complaints with the Privacy Commissioner of Canada</li>
              <li><strong>Portability:</strong> Request transfer of your information (where technically feasible)</li>
              <li><strong>Deletion:</strong> Request deletion after legal retention periods expire</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Privacy Breach Notification</h2>
            <p className="text-gray-700 mb-6">
              In compliance with PIPEDA and Bill C-11 amendments, in the event of a privacy breach that poses real risk of significant harm:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>We will notify the Privacy Commissioner of Canada as soon as feasible</li>
              <li>Affected individuals will be notified as soon as feasible after we become aware</li>
              <li>Notification will include nature of breach, steps taken, and recommended actions</li>
              <li>We maintain detailed records of all privacy incidents as required by law</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For privacy-related questions, requests, or complaints under PIPEDA:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700">
                <strong>Privacy Officer:</strong> Ramika Bahri<br/>
                <strong>Email:</strong> privacy@ramikabahri.ca<br/>
                <strong>Subject:</strong> Privacy Request - [Your Name]<br/>
                <strong>Response Time:</strong> 30 days as required by PIPEDA
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-blue-800 font-medium mb-2">Privacy Commissioner of Canada</p>
              <p className="text-blue-700 text-sm">
                If you are not satisfied with our response to your privacy concerns, you may file a complaint with:<br/>
                <strong>Office of the Privacy Commissioner of Canada</strong><br/>
                30 Victoria Street, Gatineau, Quebec K1A 1H3<br/>
                Phone: 1-800-282-1376<br/>
                Website: priv.gc.ca
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Provincial Privacy Laws</h2>
            <p className="text-gray-700 mb-6">
              This policy also complies with applicable provincial privacy legislation including:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Alberta: Personal Information Protection Act (PIPA)</li>
              <li>British Columbia: Personal Information Protection Act (PIPA)</li>
              <li>Quebec: An Act Respecting the Protection of Personal Information in the Private Sector</li>
              <li>Other provinces: PIPEDA applies as federal legislation</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-700 mb-6">
              We may update this privacy policy to reflect changes in Canadian privacy law, CRA requirements, or our practices. Material changes will be communicated by email to active clients at least 30 days before taking effect. Continued use of our services after policy changes constitutes acceptance of the updated policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}