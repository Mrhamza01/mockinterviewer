"use client"
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { usePathname,useRouter } from 'next/navigation'
import Link from "next/link";

const Header = () => {
    const pathname = usePathname()
    const router = useRouter()
  // Define the primary color (you can set this dynamically)
  const primaryColor = "#FF5733"; // Example color

  return (
    <div className="flex justify-between bg-secondary shadow-sm items-center">
      <Image src="/logo.svg" alt="logo" width={30} height={50} />
      <ul className="hidden md:flex md:gap-6 ">
        <Link href="/dashboard">
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
            pathname === "/dashboard" ? "text-blue-700 font-bold  border border-blue-700 rounded p-0.5" : ""
          }`}
        >
          Dashboard
        </li>
        </Link>
        <Link href="/questions">

        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
            pathname === "/questions" ? "text-blue-700 font-bold  border border-blue-700 rounded p-0.5" : ""
          }`}
        >
          Questions
        </li>
        </Link>
        <Link href="/upgrade">

        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
            pathname === "/upgrade" ? "text-blue-700 font-bold  border border-blue-700 rounded p-0.5": ""
          }`}
        >
          Upgrade
        </li>
        </Link>
        <Link href="/how-it-works">
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
            pathname === "/how-it-works" ? "text-blue-700 font-bold  border border-blue-700 rounded p-0.5" : ""
          }`}
        >
          How it Works
        </li>
        </Link>

      </ul>
      <UserButton />
    </div>
  );
};

export default Header;
