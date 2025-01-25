import { SignIn } from "@clerk/nextjs";
import React from "react";

export default function SignUp() {
  return (
    <div>
      <SignIn forceRedirectUrl={"/dashboard"} />
    </div>
  );
}
