import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";

export default function Home() {
  return (
    <>
      <h1>Yurt</h1>
      <p>Initial </p>
      <Button variant="default">Click me</Button>
      <div className="absolute top-4 right-2">
        <ModeToggle />
      </div>
    </>
  );
}
