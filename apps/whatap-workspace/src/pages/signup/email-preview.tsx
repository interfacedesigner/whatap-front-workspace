import { EmailVerificationTemplate } from '@/features/signup';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/signup/email-preview')({
  component: EmailPreviewPage,
});

function EmailPreviewPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4 py-10'>
      <EmailVerificationTemplate
        inviteeName='John'
        inviterName='Jane'
        workspaceName='Acme Corp'
        inviterEmail='jane@acme.com'
        otpCode='482937'
      />
    </div>
  );
}
