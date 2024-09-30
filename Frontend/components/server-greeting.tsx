import Image from "next/image";

import yurtGreeting from "@/public/yurt_greeting.png";

export default function ServerGreeting() {
  return (
    <div className="flex flex-col h-dvh justify-center items-center bg-white">
      {/* <div className="font-medium text-5xl antialiased">Welcome to Yurt</div> */}
      <Image alt="" src={yurtGreeting} />
    </div>
  );
}
