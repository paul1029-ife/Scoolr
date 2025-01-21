import Link from "next/link";
import React from "react";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center w-full">
      <Link href="/dashboard">Login</Link>
    </div>
  );
};

export default LoginPage;
