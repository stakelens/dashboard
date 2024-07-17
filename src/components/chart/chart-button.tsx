export function ChartButton({
  active,
  onClick,
  label
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <div
      className={
        active
          ? 'bg-[#2E46C8] rounded border border-white border-opacity-10 px-3 py-1 select-none duration-100'
          : 'bg-[#242424] rounded border border-white border-opacity-10 px-3 py-1 select-none cursor-pointer duration-100 hover:brightness-90'
      }
      onClick={onClick}
    >
      {label}
    </div>
  );
}
