export default function SummaryCard({
  title,
  value,
  valueClass,
}: {
  title: string;
  value: number;
  valueClass: string;
}) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <p className="text-xs font-medium text-[#64748B]">
        {title}
      </p>

      <p className={`mt-2 text-[24px] font-extrabold ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}