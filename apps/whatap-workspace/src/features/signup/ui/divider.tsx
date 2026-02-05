export function Divider({ text = 'or sign up with email' }: { text?: string }) {
  return (
    <div className='flex items-center gap-3 w-full'>
      <div className='flex-1 h-px bg-[#adadad]' />
      <span className='text-xs text-[#757575]'>{text}</span>
      <div className='flex-1 h-px bg-[#adadad]' />
    </div>
  );
}
