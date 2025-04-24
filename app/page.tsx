import Homepage from "@/components/Homepage";
import { HydrateClient } from "@/trpc/server";

export default function Home() {
  return (
    <HydrateClient>
      <Homepage />
    </HydrateClient>
  );
}
