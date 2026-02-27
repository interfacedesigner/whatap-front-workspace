/**
 * TagInput
 * @description 이메일 태그 입력 컴포넌트. Enter 또는 쉼표로 태그 추가,
 * Backspace로 마지막 태그 삭제. Step 3 멤버 초대에서 사용
 */
import { cn } from '@/shared/lib/utils';
import { X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  validate?: (value: string) => string | null;
  maxTags?: number;
  className?: string;
}

export function TagInput({
  tags,
  onTagsChange,
  placeholder = 'Type and press Enter...',
  validate,
  maxTags = 20,
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) {
        return;
      }

      // 중복 체크
      if (tags.includes(trimmed)) {
        setError('This email has already been added.');
        return;
      }

      // 최대 개수 체크
      if (tags.length >= maxTags) {
        setError(`Maximum ${maxTags} tags allowed.`);
        return;
      }

      // 유효성 검증
      if (validate) {
        const err = validate(trimmed);
        if (err) {
          setError(err);
          return;
        }
      }

      setError(null);
      onTagsChange([...tags, trimmed]);
      setInputValue('');
    },
    [tags, onTagsChange, validate, maxTags],
  );

  const removeTag = useCallback(
    (index: number) => {
      const next = [...tags];
      next.splice(index, 1);
      onTagsChange(next);
      setError(null);
    },
    [tags, onTagsChange],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const emails = pastedText.split(/[,;\s]+/).filter(Boolean);
    for (const email of emails) {
      addTag(email);
    }
  };

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div
        className={cn(
          'flex flex-wrap gap-1.5 min-h-[40px] rounded-md border px-3 py-2 focus-within:ring-2 focus-within:ring-[#296cf2]/20 focus-within:border-[#296cf2] transition-colors cursor-text',
          error ? 'border-red-500' : 'border-zinc-200',
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Tags */}
        {tags.map((tag, index) => (
          <span
            key={tag}
            className='inline-flex items-center gap-1 bg-[#296cf2]/10 text-[#296cf2] text-xs font-medium px-2 py-1 rounded-md'
          >
            {tag}
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              className='hover:bg-[#296cf2]/20 rounded-full p-0.5 transition-colors'
            >
              <X className='w-3 h-3' />
            </button>
          </span>
        ))}

        {/* Input */}
        <input
          ref={inputRef}
          type='text'
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={() => {
            if (inputValue.trim()) {
              addTag(inputValue);
            }
          }}
          placeholder={tags.length === 0 ? placeholder : ''}
          className='flex-1 min-w-[120px] border-0 p-0 text-sm outline-none bg-transparent placeholder:text-zinc-400'
        />
      </div>

      {/* Error */}
      {error && <p className='text-xs text-red-500'>{error}</p>}

      {/* Helper text */}
      <p className='text-xs text-zinc-400'>
        Press Enter or comma to add. {tags.length}/{maxTags}
      </p>
    </div>
  );
}
