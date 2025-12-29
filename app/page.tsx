import { redirect } from "next/navigation";

export default function Home() {
  // Immediately send users to the main farm dashboard
  redirect("/dashboard");
}
