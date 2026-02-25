import { Button } from './button';

interface GoogleOAuthButtonProps {
  onClick?: () => void;
  isLoading?: boolean;
}

export function GoogleOAuthButton({ onClick, isLoading = false }: GoogleOAuthButtonProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    // TODO: Implement Google OAuth flow
  };

  return (
    <Button
      variant='outline'
      className='w-full h-10 border-[#adadad] text-[#222] text-sm rounded gap-2'
      onClick={handleClick}
      disabled={isLoading}
    >
      <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
        <path
          d='M15.68 8.18c0-.567-.05-1.112-.146-1.636H8v3.094h4.306a3.68 3.68 0 01-1.597 2.415v2.007h2.585c1.513-1.393 2.386-3.444 2.386-5.88z'
          fill='#4285F4'
        />
        <path
          d='M8 16c2.16 0 3.97-.716 5.294-1.94l-2.585-2.008c-.717.48-1.633.764-2.71.764-2.083 0-3.847-1.408-4.476-3.299H.85v2.073A7.997 7.997 0 008 16z'
          fill='#34A853'
        />
        <path
          d='M3.524 9.517A4.81 4.81 0 013.273 8c0-.527.09-1.04.25-1.517V4.41H.85A7.996 7.996 0 000 8c0 1.291.31 2.513.85 3.59l2.674-2.073z'
          fill='#FBBC05'
        />
        <path
          d='M8 3.182c1.175 0 2.23.404 3.058 1.196l2.295-2.294C11.967.792 10.156 0 8 0A7.997 7.997 0 00.85 4.41l2.674 2.073C4.153 4.592 5.917 3.182 8 3.182z'
          fill='#EA4335'
        />
      </svg>
      Continue with Google
    </Button>
  );
}
