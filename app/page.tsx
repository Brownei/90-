import Homepage from "@/components/Homepage";
import Nav from "@/components/Nav";
import { getServerSession } from "next-auth";
import { OPTIONS } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(OPTIONS)
  console.log({session})

  return (
    <>
      <Nav />
      <Homepage />
    </>
  );
}
