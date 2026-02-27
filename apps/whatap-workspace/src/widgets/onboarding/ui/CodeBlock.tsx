/**
 * CodeBlock
 * @description install.sh 코드 블록 + 복사 버튼. Step 2 Agent Install에서 사용
 */
import { cn } from '@/shared/lib/utils';
import { Check, Copy } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}

export function CodeBlock({ code, language = 'bash', title, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy to clipboard.');
    }
  }, [code]);

  return (
    <div className={cn('rounded-lg border border-zinc-200 overflow-hidden bg-zinc-950', className)}>
      {/* Header */}
      <div className='flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800'>
        <div className='flex items-center gap-2'>
          {/* Terminal dots */}
          <div className='flex gap-1.5'>
            <div className='w-3 h-3 rounded-full bg-red-500/80' />
            <div className='w-3 h-3 rounded-full bg-yellow-500/80' />
            <div className='w-3 h-3 rounded-full bg-green-500/80' />
          </div>
          {title && <span className='text-xs text-zinc-400 ml-2'>{title}</span>}
        </div>

        <button
          type='button'
          onClick={handleCopy}
          className='flex items-center gap-1.5 px-2 py-1 rounded text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors'
        >
          {copied ? (
            <>
              <Check className='w-3.5 h-3.5 text-green-400' />
              <span className='text-green-400'>Copied</span>
            </>
          ) : (
            <>
              <Copy className='w-3.5 h-3.5' />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <pre className='p-4 overflow-x-auto'>
        <code className={cn('text-sm font-mono leading-relaxed text-zinc-300', `language-${language}`)}>{code}</code>
      </pre>
    </div>
  );
}
