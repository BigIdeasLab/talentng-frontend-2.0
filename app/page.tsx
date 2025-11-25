import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <h1 className="text-4xl font-bold">Hello, World!</h1>
      <p className="mt-4 text-lg text-gray-600">
        Welcome to your new application.
      </p>
      <Button asChild className="mt-8">
        <Link href="/login">Get Started</Link>
      </Button>
    </div>
  );
}
