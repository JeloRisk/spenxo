"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard"); // Automatically redirect to /dashboard
  }, [router]);

  return null; // Or show a loading spinner if you want
}