import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { useState } from 'react';

// ─── Legal Content ─────────────────────────────────────

type LegalKey = 'Privacy' | 'Terms' | 'Security' | 'Compliance';

const LEGAL_CONTENT: Record<LegalKey, { title: string; content: React.ReactNode }> = {
  Privacy: {
    title: 'Privacy Policy',
    content: (
      <div className='space-y-6 text-sm text-muted-foreground leading-relaxed'>
        <p className='text-xs text-muted-foreground/60'>Last Updated: March 1, 2026</p>

        <section className='space-y-2'>
          <h3 className='text-foreground font-semibold'>1. Overview</h3>
          <p>
            WhaTap Labs, Inc. (&quot;Company,&quot; &quot;we,&quot; &quot;us&quot;) operates the OpsGent platform. This
            Privacy Policy explains how we collect, use, disclose, and safeguard your personal information in accordance
            with applicable laws, including the Korea Personal Information Protection Act (PIPA,{' '}
            <span className='font-medium'>&#44060;&#51064;&#51221;&#48372;&#48372;&#54840;&#48277;</span>) and the
            California Consumer Privacy Act (CCPA).
          </p>
        </section>

        <section className='space-y-2'>
          <h3 className='text-foreground font-semibold'>2. Information We Collect</h3>
          <ul className='list-disc pl-5 space-y-1'>
            <li>
              <span className='text-foreground font-medium'>Account Information:</span> Name, email address, company
              name, job title, phone number.
            </li>
            <li>
              <span className='text-foreground font-medium'>Usage Data:</span> Log data, device information, IP
              addresses, browser type, pages visited.
            </li>
            <li>
              <span className='text-foreground font-medium'>Infrastructure Data:</span> Server metrics, application
              performance data, and incident logs submitted through the OpsGent agent.
            </li>
          </ul>
        </section>

        <section className='space-y-2'>
          <h3 className='text-foreground font-semibold'>3. Purpose and Legal Basis</h3>
          <p>We process personal information for the following purposes:</p>
          <ul className='list-disc pl-5 space-y-1'>
            <li>Providing and maintaining the OpsGent platform</li>
            <li>User authentication and access control (RBAC)</li>
            <li>Incident detection, classification, and automated remediation</li>
            <li>Customer support and communication</li>
            <li>Legal compliance and audit logging</li>
          </ul>
          <p>
            Under PIPA, we process data based on your consent and contractual necessity. Under CCPA, we do not sell
            personal information.
          </p>
        </section>

        <section className='space-y-2'>
          <h3 className='text-foreground font-semibold'>4. Data Retention</h3>
          <p>
            Personal information is retained for the duration of your account and for up to 3 years after termination,
            unless a longer retention period is required by law. Under PIPA, we destroy personal information without
            delay when the purpose of collection has been achieved.
          </p>
        </section>

        <section className='space-y-2'>
          <h3 className='text-foreground font-semibold'>5. Your Rights</h3>
          <p className='font-medium text-foreground'>Under Korean PIPA:</p>
          <ul className='list-disc pl-5 space-y-1'>
            <li>Right to access, correct, delete, or suspend processing of your personal information</li>
            <li>Right to withdraw consent at any time</li>
            <li>Right to request disclosure of personal information processing</li>
          </ul>
          <p className='font-medium text-foreground mt-3'>Under US CCPA (California residents):</p>
          <ul className='list-disc pl-5 space-y-1'>
            <li>Right to know what personal information is collected, used, and shared</li>
            <li>Right to delete personal information</li>
            <li>Right to opt-out of the sale of personal information</li>
            <li>Right to non-discrimination for exercising your rights</li>
          </ul>
        </section>

        <section className='space-y-2'>
          <h3 className='text-foreground font-semibold'>6. Cross-Border Transfers</h3>
          <p>
            Your data may be processed in the Republic of Korea and the United States. We implement appropriate
            safeguards including encryption in transit and at rest, and contractual data protection agreements compliant
            with PIPA Article 17 (Provision of Personal Information to Third Parties).
          </p>
        </section>

        <section className='space-y-2'>
          <h3 className='text-foreground font-semibold'>7. Contact</h3>
          <p>
            Privacy Officer: <span className='text-foreground'>privacy@whatap.io</span>
          </p>
          <p>WhaTap Labs, Inc., 13F #1303, 17 Seocho-daero 77-gil, Seocho-gu, Seoul 06614, Republic of Korea</p>
        </section>
      </div>
    ),
  },

  Terms: {
    title: 'Terms of Service',
    content: (
      <div className='space-y-6 text-sm text-muted-foreground leading-relaxed'>
        <p className='text-xs text-muted-foreground/60'>Last Updated: March 1, 2026</p>

        <section className='space-y-2'>
          <h3 className='text-foreground font-semibold'>1. Acceptance of Terms</h3>
          <p>
            By accessing or using the OpsGent platform provided by WhaTap Labs, Inc. (&quot;Company&quot;), you agree to
            be bound by these Terms of Service. If you are using the platform on behalf of an organization, you
            represent that you have authority to bind that organization to these terms.
          </p>
        </section>

        <section className='space-y-2'>
          <h3 className='text-foreground font-semibold'>2. Service Description</h3>
          <p>
            OpsGent is an AI-powered IT operations management platform that provides infrastructure monitoring, incident
            management, automated remediation, and role-based access control (RBAC). The platform includes AI-driven
            features such as automated root cause analysis and ActionBook execution.
          </p>
        </section>

        <section className='space-y-2'>
          <h3 className='text-foreground font-semibold'>3. User Accounts and Responsibilities</h3>
          <ul className='list-disc pl-5 space-y-1'>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You must provide accurate and complete registration information.</li>
            <li>You agree not to share accounts or use the platform for unauthorized purposes.</li>
            <li>You are responsible for all activities that occur under your account.</li>
          </ul>
        </section>

        <section className='space-y-2'>
          <h3 className='text-foreground font-semibold'>4. Intellectual Property</h3>
          <p>
            All intellectual property rights in the OpsGent platform, including software, design, and documentation, are
            owned by WhaTap Labs, Inc. Your use of the platform does not transfer any ownership rights. You retain
            ownership of your data submitted to the platform.
          </p>
        </section>

        <section className='space-y-2'>
          <h3 className='text-foreground font-semibold'>5. Service Level Agreement</h3>
          <p>
            We target 99.9% uptime availability for the OpsGent platform. Scheduled maintenance windows will be
            communicated at least 48 hours in advance. Service credits may apply for downtime exceeding the SLA, as
            specified in your subscription agreement.
          </p>
        </section>

        <section className='space-y-2'>
          <h3 className='text-foreground font-semibold'>6. Limitation of Liability</h3>
          <p>
            To the maximum extent permitted by applicable law, WhaTap Labs shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages arising from your use of the platform. Our total
            liability shall not exceed the fees paid by you in the 12 months preceding the claim.
          </p>
        </section>

        <section className='space-y-2'>
          <h3 className='text-foreground font-semibold'>7. Governing Law and Dispute Resolution</h3>
          <p>
            These Terms are governed by and construed in accordance with the laws of the Republic of Korea. For users
            located in the United States, disputes shall be resolved through binding arbitration in accordance with the
            rules of the Korean Commercial Arbitration Board (KCAB). The Seoul Central District Court shall have
            exclusive jurisdiction for Korean users.
          </p>
        </section>

        <section className='space-y-2'>
          <h3 className='text-foreground font-semibold'>8. Termination</h3>
          <p>
            Either party may terminate the service with 30 days&apos; written notice. We may suspend or terminate access
            immediately for violations of these terms. Upon termination, your data will be retained for 30 days, after
            which it will be permanently deleted unless retention is required by law.
          </p>
        </section>
      </div>
    ),
  },

  Security: {
    title: 'Security Policy',
    content: (
      <div className='space-y-6 text-sm text-muted-foreground leading-relaxed'>
        <p className='text-xs text-muted-foreground/60'>Last Updated: March 1, 2026</p>

        <section className='space-y-2'>
          <h3 className='text-foreground font-semibold'>1. Security Architecture</h3>
          <p>
            OpsGent implements a defense-in-depth security architecture designed to protect your infrastructure data and
            operational information at every layer.
          </p>
          <ul className='list-disc pl-5 space-y-1'>
            <li>
              <span className='text-foreground font-medium'>Encryption:</span> TLS 1.3 for data in transit, AES-256 for
              data at rest
            </li>
            <li>
              <span className='text-foreground font-medium'>Authentication:</span> Multi-factor authentication (MFA),
              SSO/SAML support, JWT with token rotation
            </li>
            <li>
              <span className='text-foreground font-medium'>Authorization:</span> Role-Based Access Control (RBAC) with
              deny-by-default policy evaluation
            </li>
          </ul>
        </section>

        <section className='space-y-2'>
          <h3 className='text-foreground font-semibold'>2. Infrastructure Security</h3>
          <ul className='list-disc pl-5 space-y-1'>
            <li>Hosted on ISO 27001-certified cloud infrastructure</li>
            <li>Network segmentation and Web Application Firewall (WAF)</li>
            <li>DDoS protection and rate limiting</li>
            <li>Regular vulnerability scanning and penetration testing</li>
            <li>Immutable infrastructure with automated patching</li>
          </ul>
        </section>

        <section className='space-y-2'>
          <h3 className='text-foreground font-semibold'>3. ActionBook Safety</h3>
          <p>The ActionBook execution engine implements a Safe DSL with built-in security controls:</p>
          <ul className='list-disc pl-5 space-y-1'>
            <li>Only whitelisted functions may be executed — no arbitrary shell commands</li>
            <li>Critical operations require explicit human approval</li>
            <li>Automatic rollback on step failure</li>
            <li>Full audit trail for all executions</li>
          </ul>
        </section>

        <section className='space-y-2'>
          <h3 className='text-foreground font-semibold'>4. Incident Response</h3>
          <p>
            We maintain a 24/7 security incident response team with defined escalation procedures. Security incidents
            are classified by severity and communicated to affected customers within 72 hours, in compliance with PIPA
            Article 34 (Notification of Personal Information Breach) and applicable US state breach notification laws.
          </p>
        </section>

        <section className='space-y-2'>
          <h3 className='text-foreground font-semibold'>5. Data Isolation</h3>
          <p>
            Each workspace operates in a logically isolated environment. Cross-tenant data access is prevented at the
            application, database, and network layers. RBAC policies enforce workspace-scoped permissions.
          </p>
        </section>

        <section className='space-y-2'>
          <h3 className='text-foreground font-semibold'>6. Reporting Vulnerabilities</h3>
          <p>
            If you discover a security vulnerability, please report it to{' '}
            <span className='text-foreground'>security@whatap.io</span>. We operate a responsible disclosure program and
            aim to acknowledge reports within 24 hours.
          </p>
        </section>
      </div>
    ),
  },

  Compliance: {
    title: 'Compliance',
    content: (
      <div className='space-y-6 text-sm text-muted-foreground leading-relaxed'>
        <p className='text-xs text-muted-foreground/60'>Last Updated: March 1, 2026</p>

        <section className='space-y-2'>
          <h3 className='text-foreground font-semibold'>1. Regulatory Framework</h3>
          <p>OpsGent is designed to meet compliance requirements across multiple jurisdictions:</p>
          <ul className='list-disc pl-5 space-y-1'>
            <li>
              <span className='text-foreground font-medium'>Republic of Korea:</span> Personal Information Protection
              Act (PIPA), Act on Promotion of Information and Communications Network Utilization and Information
              Protection, Cloud Computing Act
            </li>
            <li>
              <span className='text-foreground font-medium'>United States:</span> CCPA/CPRA (California), SOC 2 Type II,
              HIPAA (where applicable)
            </li>
            <li>
              <span className='text-foreground font-medium'>International:</span> ISO/IEC 27001, ISO/IEC 27017 (Cloud
              Security), ISO/IEC 27018 (PII in Cloud)
            </li>
          </ul>
        </section>

        <section className='space-y-2'>
          <h3 className='text-foreground font-semibold'>2. Certifications</h3>
          <ul className='list-disc pl-5 space-y-1'>
            <li>
              <span className='text-foreground font-medium'>ISMS-P:</span> Korea Internet &amp; Security Agency (KISA)
              Information Security Management System certification
            </li>
            <li>
              <span className='text-foreground font-medium'>CSAP:</span> Cloud Security Assurance Program certification
              by KISA
            </li>
            <li>
              <span className='text-foreground font-medium'>SOC 2 Type II:</span> Annual audit for Security,
              Availability, and Confidentiality trust service criteria
            </li>
            <li>
              <span className='text-foreground font-medium'>ISO 27001:</span> Information Security Management System
              certification
            </li>
          </ul>
        </section>

        <section className='space-y-2'>
          <h3 className='text-foreground font-semibold'>3. Audit Logging</h3>
          <p>
            All RBAC changes, data access events, and administrative actions are recorded with immutable audit logs.
            Audit logs include timestamps, actor identity, action performed, and affected resources. Logs are retained
            for a minimum of 5 years in compliance with Korean regulatory requirements.
          </p>
        </section>

        <section className='space-y-2'>
          <h3 className='text-foreground font-semibold'>4. Data Residency</h3>
          <p>
            Primary data processing occurs in Seoul, Republic of Korea. For customers requiring specific data residency,
            we support regional deployment options. Cross-border data transfers comply with PIPA Chapter 5 and are
            subject to data protection impact assessments.
          </p>
        </section>

        <section className='space-y-2'>
          <h3 className='text-foreground font-semibold'>5. Third-Party Risk Management</h3>
          <p>
            All sub-processors and third-party integrations undergo security assessments before onboarding. We maintain
            a current list of sub-processors and notify customers of changes with 30 days&apos; advance notice, in
            accordance with data processing agreements.
          </p>
        </section>

        <section className='space-y-2'>
          <h3 className='text-foreground font-semibold'>6. Compliance Inquiries</h3>
          <p>
            For compliance documentation, audit reports, or Data Processing Agreements (DPA), contact:{' '}
            <span className='text-foreground'>compliance@whatap.io</span>
          </p>
        </section>
      </div>
    ),
  },
};

const LEGAL_KEYS: LegalKey[] = ['Privacy', 'Terms', 'Security', 'Compliance'];

const productLinks = ['Features', 'Architecture', 'Workflow', 'Docs'];

// ─── Footer Component ──────────────────────────────────

export default function Footer() {
  const [openModal, setOpenModal] = useState<LegalKey | null>(null);

  return (
    <footer className='border-t border-border/20 py-16 px-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-8'>
          {/* Brand column */}
          <div className='col-span-2 md:col-span-1'>
            <div className='flex items-center mb-4'>
              <span className='text-foreground' style={{ fontSize: 'var(--text-lg)' }}>
                <span style={{ fontWeight: 100 }}>Ops</span>
                <span style={{ fontWeight: 'var(--font-weight-normal)' as unknown as number }}>Gent</span>
              </span>
            </div>
            <p className='text-muted-foreground' style={{ fontSize: 'var(--text-xs)', lineHeight: '1.6' }}>
              AI-powered operations agent for modern infrastructure. Detect, classify, remediate — autonomously.
            </p>
          </div>

          {/* Product column */}
          <div>
            <span
              className='text-foreground block mb-4'
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-bold)' as unknown as number,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Product
            </span>
            <ul className='flex flex-col gap-2'>
              {productLinks.map((item) => (
                <li key={item}>
                  <a
                    href='#'
                    className='text-muted-foreground hover:text-foreground transition-colors duration-300'
                    style={{ fontSize: 'var(--text-xs)' }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal column — opens modals */}
          <div>
            <span
              className='text-foreground block mb-4'
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-bold)' as unknown as number,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Legal
            </span>
            <ul className='flex flex-col gap-2'>
              {LEGAL_KEYS.map((key) => (
                <li key={key}>
                  <button
                    type='button'
                    onClick={() => setOpenModal(key)}
                    className='text-muted-foreground hover:text-foreground transition-colors duration-300 cursor-pointer'
                    style={{ fontSize: 'var(--text-xs)' }}
                  >
                    {key}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className='mt-12 pt-8 border-t border-border/20 flex flex-col md:flex-row items-center justify-between gap-4'>
          <span className='text-muted-foreground' style={{ fontSize: 'var(--text-xs)' }}>
            &copy; 2026 OpsGent. All rights reserved.
          </span>
          <div className='flex items-center gap-6 text-muted-foreground' style={{ fontSize: 'var(--text-xs)' }}>
            <span>13F #1303, 17 Seocho-daero 77-gil, Seocho-gu, Seoul 06614 — WhaTap Labs, Inc.</span>
            <span className='hidden md:inline'>|</span>
            <a href='tel:+82-2-6004-7148' className='hover:text-foreground transition-colors duration-300'>
              +82-2-6004-7148
            </a>
            <span className='hidden md:inline'>|</span>
            <a href='mailto:support@whatap.io' className='hover:text-foreground transition-colors duration-300'>
              support@whatap.io
            </a>
          </div>
        </div>
      </div>

      {/* Legal Modals */}
      {LEGAL_KEYS.map((key) => (
        <Dialog key={key} open={openModal === key} onOpenChange={(open) => setOpenModal(open ? key : null)}>
          <DialogContent className='sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col'>
            <DialogHeader className='shrink-0'>
              <DialogTitle style={{ fontSize: 'var(--text-lg)' }}>{LEGAL_CONTENT[key].title}</DialogTitle>
            </DialogHeader>
            <div className='flex-1 overflow-y-auto -mx-6 px-6 min-h-0'>{LEGAL_CONTENT[key].content}</div>
          </DialogContent>
        </Dialog>
      ))}
    </footer>
  );
}
