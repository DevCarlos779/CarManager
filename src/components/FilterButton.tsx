interface FilterButtonProps {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export default function FilterButton({ active, onClick, children }: FilterButtonProps) {
  return (
    <button
      className={
        active
          ? "h-8 cursor-pointer rounded-full bg-[#1E3A8A] px-4 text-xs font-semibold text-white"
          : "h-8 cursor-pointer rounded-full border border-[#E2E8F0] bg-white px-4 text-xs font-medium text-[#64748B] transition hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
}