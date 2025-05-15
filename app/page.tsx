import Homepage from "@/components/Homepage";
import Nav from "@/components/Nav";
import { cookies } from "next/headers";

export default async function Home() {
  return (
    <>
      <Nav />
      <Homepage />
    </>
  );
}
