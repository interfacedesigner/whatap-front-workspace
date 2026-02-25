import { cn } from '@/shared/lib/utils';
import { type ClipboardEvent, type KeyboardEvent, useCallback, useRef } from 'react';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

export function OtpInput({ length = 6, value, onChange, onComplete, disabled = false, error = false }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = value.split('').concat(Array(length).fill('')).slice(0, length);

  const focusInput = useCallback(
    (index: number) => {
      if (index >= 0 && index < length) {
        inputRefs.current[index]?.focus();
      }
    },
    [length],
  );

  const handleChange = useCallback(
    (index: number, char: string) => {
      if (!/^\d$/.test(char)) {
        return;
      }

      const newValue = digits.map((d, i) => (i === index ? char : d)).join('');
      onChange(newValue.replace(/ /g, ''));

      if (index < length - 1) {
        focusInput(index + 1);
      }

      const trimmed = newValue.replace(/ /g, '');
      if (trimmed.length === length) {
        onComplete?.(trimmed);
      }
    },
    [digits, onChange, onComplete, length, focusInput],
  );

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (digits[index] && digits[index] !== ' ') {
          const newValue = digits.map((d, i) => (i === index ? ' ' : d)).join('');
          onChange(newValue.replace(/ /g, ''));
        } else if (index > 0) {
          const newValue = digits.map((d, i) => (i === index - 1 ? ' ' : d)).join('');
          onChange(newValue.replace(/ /g, ''));
          focusInput(index - 1);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        focusInput(index - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        focusInput(index + 1);
      }
    },
    [digits, onChange, focusInput],
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
      if (pasted.length === 0) {
        return;
      }

      onChange(pasted);
      focusInput(Math.min(pasted.length, length - 1));

      if (pasted.length === length) {
        onComplete?.(pasted);
      }
    },
    [onChange, onComplete, length, focusInput],
  );

  return (
    <div className='flex gap-2 justify-center'>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type='text'
          inputMode='numeric'
          maxLength={1}
          value={digits[index] === ' ' ? '' : digits[index]}
          disabled={disabled}
          className={cn(
            'w-10 h-12 text-center text-lg font-medium border rounded-md outline-none transition-all',
            'focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20',
            error ? 'border-red-500 bg-red-50' : 'border-[#adadad] bg-white',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          autoFocus={index === 0}
        />
      ))}
    </div>
  );
}
