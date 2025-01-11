export default function SplashScreen({
  isFading = false,
}: {
  isFading?: boolean;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 h-screen w-screen bg-primary flex flex-col justify-center items-center transition-opacity duration-500 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      <p className="text-5xl text-[#334900]">Loading...</p>
    </div>
  );
}
