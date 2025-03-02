import { SignUp } from "@clerk/nextjs";

export default function page() {
  return (
    <div className="w-full pt-20 h-full flex items-center justify-center">
      <SignUp forceRedirectUrl={"/dashboard"} />
    </div>
  );
}
