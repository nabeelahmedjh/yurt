import { redirect } from "next/navigation";

export default function HomeLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  // redirect("/servers");

  return (
    <>
      <div>{children}</div>
    </>
  );
}
