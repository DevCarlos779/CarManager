export default function FilterButton({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      className={
        active
          ? "h-8 rounded-full bg-[#1E3A8A] px-4 text-xs font-semibold text-white"
          : "h-8 rounded-full border border-[#E2E8F0] bg-white px-4 text-xs font-medium text-[#64748B] transition hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
      }
    >
      {children}
    </button>
  );
}