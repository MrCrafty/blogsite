import Home from "@/app/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogsite",
};
export default async function Page() {
  return (
    <>
      <Home />
    </>
  );
}
