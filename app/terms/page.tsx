export default function TermsOfService() {
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-gray-600">Last updated: January 2026</p>
          </div>

          <div className="prose max-w-none">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
              <p className="text-red-800 font-medium">
                <strong>Important:</strong> These terms are governed by Canadian federal and provincial law. Services are provided in accordance with Canada Revenue Agency (CRA) regulations and professional accounting standards in Canada.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Service Description</h2>
            <p className="text-gray-700 mb-6">
              Ramika Bahri provides personal income tax preparation and consultation services for Canadian residents and non-residents with Canadian tax obligations. Services include:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Federal and provincial tax return preparation and electronic filing with CRA</li>
              <li>Tax planning and optimization strategies for Canadian tax law</li>
              <li>Assistance with CRA correspondence, notices, and reassessments</li>
              <li>Advice on RRSP/TFSA contributions, capital gains, and tax credits</li>
              <li>Support for self-employed individuals and small business owners</li>
              <li>Representation before the Canada Revenue Agency (where permitted)</li>
            </ul>
            
            <div className="bg-yellow-50 p-4 rounded-lg mb-6">
              <p className="text-yellow-800 font-medium mb-2">Professional Status Notice:</p>
              <p className="text-yellow-700 text-sm">
                Ramika Bahri is an aspiring Chartered Professional Accountant (CPA) and is not yet a licensed CPA. Tax preparation services are provided under applicable regulations for tax preparers in Canada.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Client Responsibilities Under Canadian Tax Law</h2>
            <p className="text-gray-700 mb-4">
              Under the Income Tax Act (Canada) and provincial tax legislation, you are responsible for:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Providing complete and accurate information about all sources of income</li>
              <li>Supplying all T4, T4A, T5, and other tax slips received</li>
              <li>Disclosing all deductions, credits, and expenses claimed</li>
              <li>Maintaining supporting documentation for 6 years as required by CRA</li>
              <li>Reviewing and signing your tax return before electronic filing</li>
              <li>Reporting any changes that may affect your tax situation promptly</li>
              <li>Filing any required provincial tax returns in addition to federal returns</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Service Standards and Professional Obligations</h2>
            <p className="text-gray-700 mb-6">
              Our services are provided in accordance with:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Canada Revenue Agency regulations for tax preparers</li>
              <li>Professional standards for aspiring CPAs in Canada</li>
              <li>Current federal Income Tax Act and provincial tax legislation</li>
              <li>CRA's Taxpayer Bill of Rights principles</li>
            </ul>
            <p className="text-gray-700 mb-6">
              We exercise professional due diligence in preparing your returns based on information provided and current interpretation of Canadian tax law. However, tax law is complex and subject to change, and final tax liability is determined by the Canada Revenue Agency.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">No Guarantee of Tax Outcomes</h2>
            <p className="text-gray-700 mb-6">
              We cannot guarantee specific outcomes including:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Refund amounts or timing of CRA processing</li>
              <li>Acceptance of deductions or credits claimed</li>
              <li>Avoidance of CRA reviews, audits, or reassessments</li>
              <li>Specific tax savings or optimization results</li>
              <li>Outcomes of disputes with Canada Revenue Agency</li>
            </ul>
            <p className="text-gray-700 mb-6">
              Tax results depend on your individual circumstances, accuracy of information provided, CRA processing, and changes in tax law or interpretation.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Limitation of Liability (Canadian Law)</h2>
            <p className="text-gray-700 mb-6">
              Under Canadian law, our liability is limited as follows:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li><strong>Maximum Liability:</strong> Limited to fees paid for the specific service</li>
              <li><strong>Excluded Damages:</strong> No liability for indirect, consequential, punitive, or special damages</li>
              <li><strong>CRA Penalties/Interest:</strong> Client remains responsible for all CRA-imposed penalties and interest</li>
              <li><strong>Remedy:</strong> Limited to correcting errors or refunding service fees</li>
              <li><strong>Time Limit:</strong> Claims must be brought within one year of service completion</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Professional Confidentiality (Canadian Standards)</h2>
            <p className="text-gray-700 mb-6">
              Client information confidentiality is protected under:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Professional accounting standards in Canada</li>
              <li>Personal Information Protection and Electronic Documents Act (PIPEDA)</li>
              <li>Solicitor-client privilege principles (where applicable)</li>
              <li>CRA's confidentiality requirements for authorized representatives</li>
            </ul>
            <p className="text-gray-700 mb-6">
              Information may only be disclosed with your written consent or as required by Canadian law, court order, or regulatory authority.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Payment Terms (Canadian Currency)</h2>
            <p className="text-gray-700 mb-6">
              All fees are quoted and payable in Canadian dollars (CAD). Payment terms:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Fees due upon completion unless other arrangements made in advance</li>
              <li>Accepted payment methods: e-transfer, cheque, or as otherwise agreed</li>
              <li>GST/HST will be applied as required by provincial tax jurisdiction</li>
              <li>Late payment may result in service suspension and applicable interest charges</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Termination and File Retention</h2>
            <p className="text-gray-700 mb-6">
              Either party may terminate services with written notice. Upon termination:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Payment due for all services rendered to termination date</li>
              <li>Original documents returned to client promptly</li>
              <li>Working papers retained for 6 years as required by professional standards</li>
              <li>Electronic files maintained according to CRA record-keeping requirements</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Governing Law and Jurisdiction</h2>
            <p className="text-gray-700 mb-6">
              These terms are governed by:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li><strong>Federal Law:</strong> Income Tax Act (Canada), PIPEDA, and other applicable federal statutes</li>
              <li><strong>Provincial Law:</strong> Laws of Ontario and other applicable provincial legislation</li>
              <li><strong>Jurisdiction:</strong> Courts of Ontario or the province where services are primarily provided</li>
              <li><strong>Alternative Dispute Resolution:</strong> Mediation preferred for dispute resolution</li>
            </ul>
            <p className="text-gray-700 mb-6">
              Any disputes related to these terms or services will be resolved in accordance with Canadian law and legal procedures.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Information and Professional Details</h2>\n            <p className="text-gray-700 mb-4">
              For questions about these terms or our services:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700">
                <strong>Service Provider:</strong> Ramika Bahri (Aspiring CPA)<br/>
                <strong>Business Email:</strong> info@ramikabahri.ca<br/>
                <strong>Professional Inquiries:</strong> Terms of Service Inquiry<br/>
                <strong>Services:</strong> Personal Income Tax Preparation (Canada)<br/>
                <strong>Professional Status:</strong> Aspiring Chartered Professional Accountant
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Regulatory and Professional Oversight</h2>
            <p className="text-gray-700 mb-6">
              Tax preparation services are subject to oversight by:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Canada Revenue Agency (CRA) - Tax preparer regulations</li>
              <li>Chartered Professional Accountants of Canada (CPA Canada) - Professional standards</li>
              <li>Provincial CPA bodies - Regional professional oversight</li>
              <li>Privacy Commissioner of Canada - Privacy law compliance</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Agreement and Acceptance</h2>
            <p className="text-gray-700 mb-6">
              By using our tax preparation services, you acknowledge that you have read, understood, and agree to be bound by these terms of service. You confirm that you understand:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Your obligations as a Canadian taxpayer under federal and provincial tax law</li>
              <li>The scope and limitations of tax preparation services provided</li>
              <li>Your responsibility for the accuracy and completeness of information provided</li>
              <li>The professional status and qualifications of the service provider</li>
              <li>The applicable Canadian legal framework governing these services</li>
            </ul>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mt-8">
              <p className="text-green-800 font-medium mb-2">Canadian Tax System Commitment</p>
              <p className="text-green-700 text-sm">
                We are committed to supporting the integrity of Canada's tax system through professional, accurate, and compliant tax preparation services for all Canadian taxpayers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}