import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home(){
  return (
    <div>
      <Link href="/sign-in">Log in</Link>
    </div>
    
  )
}