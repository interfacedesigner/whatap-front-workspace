import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function VerifyingOverlay() {
  const [showExtra, setShowExtra] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowExtra(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <div className='flex flex-col items-center gap-4'>
        <Loader2 className='w-10 h-10 text-white animate-spin' />
        <p className='text-white text-base font-medium'>Moving to the next step</p>
        {showExtra && <p className='text-white/70 text-sm'>This may take a few seconds.</p>}
      </div>
    </div>
  );
}
