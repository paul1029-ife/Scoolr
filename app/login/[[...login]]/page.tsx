import { SignIn } from "@clerk/nextjs";
import React from "react";

export default function Login() {
  return (
    <div className="w-full pt-20 h-full flex items-center justify-center">
      <SignIn forceRedirectUrl={"/dashboard"} />
    </div>
  );
}
