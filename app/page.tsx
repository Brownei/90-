import Homepage from "@/components/Homepage";
import Nav from "@/components/Nav";
import { cookies } from "next/headers";

export default async function Home() {
  const session = await cookies()
  console.log({session: session.get("session")})
  return (
    <>
      <Nav />
      <Homepage />
    </>
  );
}
