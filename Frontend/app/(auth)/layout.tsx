export default function layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center w-full min-h-dvh bg-gradient-to-bl from-emerald-300 to-teal-500">
      {children}
    </div>
  );
}
