interface EmailVerificationTemplateProps {
  inviteeName?: string;
  inviterName?: string;
  workspaceName?: string;
  inviterEmail?: string;
  otpCode?: string;
}

export function EmailVerificationTemplate({
  inviteeName = 'User',
  inviterName = 'Admin',
  workspaceName = 'My Workspace',
  inviterEmail = 'admin@company.com',
  otpCode = '123456',
}: EmailVerificationTemplateProps) {
  return (
    <div className='w-full max-w-[540px] mx-auto border border-[#adadad] rounded-lg bg-white font-sans'>
      {/* Subject line */}
      <div className='px-10 py-3 border-b border-[#adadad] bg-[#f9f9f9]'>
        <p className='text-xs text-[#757575]'>Subject</p>
        <p className='text-sm font-medium text-[#222]'>Your WorkSpace verification code: {otpCode}</p>
      </div>

      {/* Email body */}
      <div className='px-10 py-10 flex flex-col gap-4 text-sm text-[#222] leading-relaxed'>
        <p>Hi {inviteeName},</p>

        <p>
          {inviterName} invited you to join {workspaceName} on WorkSpace.
          <br />
          Your WhaTap verification code is:
        </p>

        <p className='text-2xl font-bold tracking-widest text-[#296cf2]'>{otpCode}</p>

        <div className='flex flex-col gap-1 text-[#757575] text-xs'>
          <p>This code expires in 15 minutes.</p>
          <p>If you didn&apos;t request this, you can ignore this email.</p>
        </div>

        <div className='border-t border-[#adadad] pt-4 mt-2 text-xs text-[#757575]'>
          <p>Need help? Contact your workspace admin ({inviterEmail}) or reply to this email.</p>
          <p className='mt-1'>&mdash; {'{WorkSpace}'} Team</p>
        </div>
      </div>
    </div>
  );
}
