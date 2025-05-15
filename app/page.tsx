import Homepage from "@/components/Homepage";
import Nav from "@/components/Nav";
import { getServerSession } from "next-auth";
import { OPTIONS } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Home() {
  // const session = await getServerSession(OPTIONS)
  // console.log({session})
  //
  // if (session === null) {
  //   redirect('/')
  // }

  return (
    <>
      <Nav />
      <Homepage />
    </>
  );
}
