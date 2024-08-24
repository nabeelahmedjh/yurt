import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className=" flex flex-col items-center justify-center h-dvh bg-[linear-gradient(135deg,_hsla(85,_99%,_37%,_1)_0%,_hsla(72,_94%,_51%,_1)_100%)]">
      <h1 className="text-[15vw] font-medium text-lime-900 transition-all animate-jump animate-once cursor-default">
        Yurt
      </h1>
      <Button
        asChild
        className="py-10 ml-4 px-[5vw] text-4xl border border-b-[6px] border-black"
      >
        <a href="/servers">Open Yurt</a>
      </Button>
    </div>
  );
}
