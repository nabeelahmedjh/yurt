import { Button } from "@/components/ui/button";
import Image from "next/image";
import StaggeredText from "@/components/stagger-text";
import Bounce from "@/components/image-bounce";

export default function Home() {
  return (
    <div className="bg-[#EDFFBD] min-h-screen flex flex-col pb-16 md:pb-1">
      <nav className="py-8 px-8 md:px-16">
        <Image
          className="size-[10vw] md:size-20"
          width={80}
          height={80}
          src="/yurt_logo.svg"
          alt=""
        />
      </nav>
      <div className="flex flex-col-reverse md:flex-row items-center justify-between min-h-[65vh] px-2 md:px-24">
        <section className="mt-16 ml-4 w-fit">
          <div className="space-y-4">
            <h1 className="mb-12 text-[clamp(1.5rem,3vw+1rem,3rem)]">
              <StaggeredText
                className="uppercase font-bold"
                text="welcome to yurt"
              />
            </h1>
            <h3 className="uppercase font-medium text-[clamp(1rem,2vw+0.5rem,2rem)]">
              where <span className="text-blue-500">focus</span> meets
            </h3>
            <h3 className="uppercase font-medium text-[clamp(1rem,2vw+0.5rem,2rem)] text-green-600">
              collaboration
            </h3>
          </div>

          <Button
            asChild
            className="px-8 md:px-16 py-4 uppercase mt-16 text-[clamp(1rem,2vw+0.5rem,1.5rem)]"
          >
            <a href="/servers">Login</a>
          </Button>
        </section>
        <Bounce>
          <Image
            className="md:pr-4 lg:pr-8 xl:pr-16 w-[70vw] sm:w-[30vw]"
            quality={100}
            width={600}
            height={600}
            src="/yurt_mascot.png"
            alt=""
          />
        </Bounce>
      </div>
    </div>
  );
}
